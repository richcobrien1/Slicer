// Electron Integration Utilities

/**
 * Check if app is running in Electron
 */
export function isElectron() {
  return !!(window.electronAPI && window.electronAPI.isElectron);
}

/**
 * Get platform (electron, web)
 */
export function getPlatform() {
  if (isElectron()) {
    return window.electronAPI.platform || 'unknown';
  }
  return 'web';
}

/**
 * Open file dialog and read file (Electron)
 */
export async function openFileElectron() {
  if (!isElectron()) {
    throw new Error('Not running in Electron');
  }

  try {
    const filePath = await window.electronAPI.openFile();
    if (!filePath) return null;

    const result = await window.electronAPI.readFile(filePath);
    if (!result.success) {
      throw new Error(result.error);
    }

    // Convert array back to Uint8Array
    const data = new Uint8Array(result.data);
    
    // Create File-like object
    const blob = new Blob([data]);
    const file = new File([blob], result.name, { type: 'model/stl' });
    
    return file;
  } catch (error) {
    console.error('Error opening file:', error);
    throw error;
  }
}

/**
 * Save file dialog and write file (Electron)
 */
export async function saveFileElectron(data, defaultName = 'model.stl') {
  if (!isElectron()) {
    throw new Error('Not running in Electron');
  }

  try {
    const filePath = await window.electronAPI.saveFile(defaultName);
    if (!filePath) return null;

    // Convert Blob to ArrayBuffer if needed
    let arrayBuffer;
    if (data instanceof Blob) {
      arrayBuffer = await data.arrayBuffer();
    } else if (data instanceof ArrayBuffer) {
      arrayBuffer = data;
    } else {
      throw new Error('Invalid data type');
    }

    const uint8Array = new Uint8Array(arrayBuffer);
    const result = await window.electronAPI.writeFile(filePath, Array.from(uint8Array));
    
    if (!result.success) {
      throw new Error(result.error);
    }

    return filePath;
  } catch (error) {
    console.error('Error saving file:', error);
    throw error;
  }
}

/**
 * Open external URL
 */
export async function openExternal(url) {
  if (isElectron()) {
    return await window.electronAPI.openExternal(url);
  } else {
    window.open(url, '_blank');
  }
}

/**
 * Show file in system folder
 */
export async function showItemInFolder(filePath) {
  if (!isElectron()) {
    console.warn('showItemInFolder only works in Electron');
    return;
  }
  
  return await window.electronAPI.showItemInFolder(filePath);
}

/**
 * Get app version
 */
export async function getAppVersion() {
  if (isElectron()) {
    return await window.electronAPI.getVersion();
  }
  return 'web';
}

/**
 * Print (Electron native or browser)
 */
export async function print(data) {
  if (isElectron()) {
    return await window.electronAPI.print(data);
  } else {
    window.print();
  }
}

/**
 * Check for updates (Electron only)
 */
export async function checkForUpdates() {
  if (!isElectron()) {
    return { hasUpdate: false };
  }
  
  return await window.electronAPI.checkForUpdates();
}

/**
 * Get app data path
 */
export async function getAppPath(name = 'userData') {
  if (isElectron()) {
    return await window.electronAPI.getPath(name);
  }
  return null;
}

/**
 * Enhanced file picker with Electron support
 */
export async function openFile(accept = '.stl,.3mf,.obj') {
  if (isElectron()) {
    return await openFileElectron();
  } else {
    // Fallback to web file picker
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = accept;
      input.onchange = (e) => {
        const file = e.target.files[0];
        resolve(file || null);
      };
      input.click();
    });
  }
}

/**
 * Enhanced save with Electron support
 */
export async function saveFile(data, defaultName = 'model.stl') {
  if (isElectron()) {
    return await saveFileElectron(data, defaultName);
  } else {
    // Fallback to web download
    const blob = data instanceof Blob ? data : new Blob([data]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = defaultName;
    a.click();
    URL.revokeObjectURL(url);
    return defaultName;
  }
}

// Log environment info
if (isElectron()) {
  console.log('🖥️ Running in Electron Desktop App');
  console.log('Platform:', getPlatform());
  getAppVersion().then(version => {
    console.log('App version:', version);
  });
} else {
  console.log('🌐 Running in Web Browser');
}

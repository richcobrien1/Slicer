const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true
    },
    title: 'SLICER - AI Automated 3D Manufacturing',
    icon: path.join(__dirname, '../public/icon.png'),
    backgroundColor: '#1a1a1a',
    show: false, // Don't show until ready
    autoHideMenuBar: true
  });

  // Show window when ready to avoid flashing
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    // Development mode - load from Vite dev server
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // Production mode - load from built files
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App lifecycle
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers for file operations

// Open file dialog
ipcMain.handle('dialog:openFile', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: '3D Models', extensions: ['stl', '3mf', 'obj'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  if (canceled) {
    return null;
  } else {
    return filePaths[0];
  }
});

// Read file
ipcMain.handle('fs:readFile', async (event, filePath) => {
  try {
    const data = fs.readFileSync(filePath);
    return {
      success: true,
      data: Array.from(new Uint8Array(data)),
      path: filePath,
      name: path.basename(filePath)
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
});

// Save file dialog
ipcMain.handle('dialog:saveFile', async (event, defaultName) => {
  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
    defaultPath: defaultName,
    filters: [
      { name: 'STL Files', extensions: ['stl'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  if (canceled) {
    return null;
  } else {
    return filePath;
  }
});

// Write file
ipcMain.handle('fs:writeFile', async (event, filePath, data) => {
  try {
    const buffer = Buffer.from(data);
    fs.writeFileSync(filePath, buffer);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
});

// Get app version
ipcMain.handle('app:getVersion', () => {
  return app.getVersion();
});

// Get app path
ipcMain.handle('app:getPath', (event, name) => {
  return app.getPath(name);
});

// Show item in folder
ipcMain.handle('shell:showItemInFolder', async (event, fullPath) => {
  const { shell } = require('electron');
  shell.showItemInFolder(fullPath);
});

// Open external link
ipcMain.handle('shell:openExternal', async (event, url) => {
  const { shell } = require('electron');
  await shell.openExternal(url);
});

// Print dialog
ipcMain.handle('dialog:print', async (event, data) => {
  try {
    // Create a temporary print window
    const printWindow = new BrowserWindow({
      show: false,
      webPreferences: {
        nodeIntegration: false
      }
    });

    // You can customize this based on your needs
    printWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(data));
    
    printWindow.webContents.on('did-finish-load', () => {
      printWindow.webContents.print({}, (success, errorType) => {
        if (!success) {
          console.error('Print failed:', errorType);
        }
        printWindow.close();
      });
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
});

// Handle app updates (for future use)
ipcMain.handle('app:checkForUpdates', async () => {
  // Implement auto-updater logic here
  return { hasUpdate: false };
});

console.log('Electron main process started');
console.log('App version:', app.getVersion());
console.log('Electron version:', process.versions.electron);
console.log('Chrome version:', process.versions.chrome);
console.log('Node version:', process.versions.node);

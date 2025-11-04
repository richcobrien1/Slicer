/**
 * Printer Integration
 * Handles sending models to printers, launching slicers, and API uploads
 */

import { ConnectionType } from './printerProfiles';
import { isElectron, sendToSlicer as electronSendToSlicer, getElectronAPI } from './electronUtils';

/**
 * Send model to printer using selected profile
 * @param {Blob} stlBlob - STL file blob
 * @param {string} filename - Filename for the model
 * @param {Object} printerProfile - Printer profile configuration
 * @param {Function} progressCallback - Progress callback(percent, message)
 * @returns {Promise<Object>} - Result object with success/error
 */
export async function sendToPrinter(stlBlob, filename, printerProfile, progressCallback = null) {
  if (!printerProfile) {
    throw new Error('No printer profile selected');
  }
  
  const notify = (percent, message) => {
    if (progressCallback) {
      progressCallback(percent, message);
    }
    console.log(`[Printer] ${percent}% - ${message}`);
  };
  
  try {
    notify(10, `Preparing to send to ${printerProfile.name}...`);
    
    switch (printerProfile.type) {
      case ConnectionType.SLICER:
        return await sendToSlicerSoftware(stlBlob, filename, printerProfile, notify);
        
      case ConnectionType.OCTOPRINT:
        return await sendToOctoPrint(stlBlob, filename, printerProfile, notify);
        
      case ConnectionType.KLIPPER:
        return await sendToKlipper(stlBlob, filename, printerProfile, notify);
        
      case ConnectionType.PRUSALINK:
        return await sendToPrusaLink(stlBlob, filename, printerProfile, notify);
        
      case ConnectionType.USB:
        return await sendToUSB(stlBlob, filename, printerProfile, notify);
        
      default:
        throw new Error(`Unknown connection type: ${printerProfile.type}`);
    }
  } catch (error) {
    notify(0, `Error: ${error.message}`);
    throw error;
  }
}

/**
 * Send model to slicer software
 */
async function sendToSlicerSoftware(stlBlob, filename, profile, notify) {
  notify(20, 'Saving STL file...');
  
  if (isElectron()) {
    // Use Electron API to save file and launch slicer
    notify(40, 'Launching slicer...');
    
    const result = await electronSendToSlicer(stlBlob, filename, profile);
    
    if (result.success) {
      notify(100, `Opened ${filename} in ${profile.slicerType}`);
      return {
        success: true,
        message: `Model opened in ${profile.slicerType}`,
        method: 'slicer'
      };
    } else {
      throw new Error(result.error || 'Failed to launch slicer');
    }
  } else {
    // Browser mode: download file and show instructions
    notify(50, 'Downloading STL file...');
    
    downloadBlob(stlBlob, filename);
    
    notify(100, 'File downloaded. Please open in your slicer manually.');
    
    return {
      success: true,
      message: `${filename} downloaded. Please open in ${profile.slicerType} manually.`,
      method: 'download',
      instructions: getSlicerInstructions(profile.slicerType)
    };
  }
}

/**
 * Send model to OctoPrint
 */
async function sendToOctoPrint(stlBlob, filename, profile, notify) {
  notify(20, 'Connecting to OctoPrint...');
  
  const apiUrl = profile.apiUrl.replace(/\/$/, ''); // Remove trailing slash
  const uploadUrl = `${apiUrl}/api/files/local`;
  
  // Create form data
  const formData = new FormData();
  formData.append('file', stlBlob, filename);
  
  if (profile.autoStart) {
    formData.append('print', 'true');
  }
  
  notify(40, 'Uploading to OctoPrint...');
  
  try {
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'X-Api-Key': profile.apiKey
      },
      body: formData
    });
    
    notify(80, 'Processing response...');
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    notify(100, profile.autoStart ? 'Print started!' : 'Upload complete!');
    
    return {
      success: true,
      message: profile.autoStart ? 
        `Print started on ${profile.name}` : 
        `Uploaded to ${profile.name}`,
      method: 'octoprint',
      data: result
    };
  } catch (error) {
    throw new Error(`OctoPrint upload failed: ${error.message}`);
  }
}

/**
 * Send model to Klipper (via Moonraker API)
 */
async function sendToKlipper(stlBlob, filename, profile, notify) {
  notify(20, 'Connecting to Klipper...');
  
  const apiUrl = profile.apiUrl.replace(/\/$/, '');
  const uploadUrl = `${apiUrl}/server/files/upload`;
  
  // Create form data
  const formData = new FormData();
  formData.append('file', stlBlob, filename);
  formData.append('root', 'gcodes'); // Upload to gcodes directory
  
  notify(40, 'Uploading to Klipper...');
  
  try {
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'X-Api-Key': profile.apiKey || ''
      },
      body: formData
    });
    
    notify(80, 'Processing response...');
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error?.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    // Auto-start print if enabled
    if (profile.autoStart && result.result === 'success') {
      notify(90, 'Starting print...');
      
      await fetch(`${apiUrl}/printer/print/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': profile.apiKey || ''
        },
        body: JSON.stringify({ filename: result.item.path })
      });
    }
    
    notify(100, profile.autoStart ? 'Print started!' : 'Upload complete!');
    
    return {
      success: true,
      message: profile.autoStart ? 
        `Print started on ${profile.name}` : 
        `Uploaded to ${profile.name}`,
      method: 'klipper',
      data: result
    };
  } catch (error) {
    throw new Error(`Klipper upload failed: ${error.message}`);
  }
}

/**
 * Send model to PrusaLink
 */
async function sendToPrusaLink(stlBlob, filename, profile, notify) {
  notify(20, 'Connecting to PrusaLink...');
  
  const apiUrl = profile.apiUrl.replace(/\/$/, '');
  const uploadUrl = `${apiUrl}/api/files/local`;
  
  // Create form data
  const formData = new FormData();
  formData.append('file', stlBlob, filename);
  
  if (profile.autoStart) {
    formData.append('print', 'true');
  }
  
  notify(40, 'Uploading to PrusaLink...');
  
  try {
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'X-Api-Key': profile.apiKey
      },
      body: formData
    });
    
    notify(80, 'Processing response...');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    notify(100, profile.autoStart ? 'Print started!' : 'Upload complete!');
    
    return {
      success: true,
      message: profile.autoStart ? 
        `Print started on ${profile.name}` : 
        `Uploaded to ${profile.name}`,
      method: 'prusalink',
      data: result
    };
  } catch (error) {
    throw new Error(`PrusaLink upload failed: ${error.message}`);
  }
}

/**
 * Send to USB printer (requires Electron)
 */
async function sendToUSB(stlBlob, filename, profile, notify) {
  if (!isElectron()) {
    throw new Error('USB printing requires desktop app. Please download and install the desktop version.');
  }
  
  notify(20, 'Preparing USB connection...');
  
  const electron = getElectronAPI();
  
  if (!electron || !electron.sendToUSBPrinter) {
    throw new Error('USB printing not available in this version');
  }
  
  notify(40, 'Sending to USB printer...');
  
  // Convert blob to buffer
  const buffer = await stlBlob.arrayBuffer();
  
  const result = await electron.sendToUSBPrinter({
    data: buffer,
    filename,
    port: profile.port,
    baudRate: profile.baudRate
  });
  
  if (result.success) {
    notify(100, 'Sent to USB printer!');
    return {
      success: true,
      message: `Sent to ${profile.name} on ${profile.port}`,
      method: 'usb'
    };
  } else {
    throw new Error(result.error || 'USB print failed');
  }
}

/**
 * Download blob as file
 */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Get instructions for manually opening file in slicer
 */
function getSlicerInstructions(slicerType) {
  const instructions = {
    prusaslicer: '1. Open PrusaSlicer\n2. Go to File → Import → Import STL\n3. Select the downloaded file\n4. Slice and send to printer',
    cura: '1. Open Cura\n2. Go to File → Open File(s)\n3. Select the downloaded file\n4. Slice and send to printer',
    orcaslicer: '1. Open OrcaSlicer\n2. Drag and drop the file into the window\n3. Slice and send to printer',
    superslicer: '1. Open SuperSlicer\n2. Go to File → Import → Import STL\n3. Select the downloaded file\n4. Slice and send to printer',
    simplify3d: '1. Open Simplify3D\n2. Go to File → Import Models\n3. Select the downloaded file\n4. Prepare and send to printer',
    bambustudio: '1. Open Bambu Studio\n2. Drag and drop the file into the window\n3. Slice and send to printer'
  };
  
  return instructions[slicerType] || 'Open your slicer and import the downloaded STL file.';
}

/**
 * Test printer connection
 */
export async function testPrinterConnection(profile) {
  try {
    switch (profile.type) {
      case ConnectionType.OCTOPRINT:
        return await testOctoPrintConnection(profile);
        
      case ConnectionType.KLIPPER:
        return await testKlipperConnection(profile);
        
      case ConnectionType.PRUSALINK:
        return await testPrusaLinkConnection(profile);
        
      case ConnectionType.SLICER:
        return {
          success: true,
          message: 'Slicer path configured. Connection will be tested when launching.'
        };
        
      case ConnectionType.USB:
        return {
          success: true,
          message: 'USB connection will be tested when sending print.'
        };
        
      default:
        return {
          success: false,
          message: 'Unknown connection type'
        };
    }
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
}

/**
 * Test OctoPrint connection
 */
async function testOctoPrintConnection(profile) {
  const apiUrl = profile.apiUrl.replace(/\/$/, '');
  
  const response = await fetch(`${apiUrl}/api/version`, {
    headers: {
      'X-Api-Key': profile.apiKey
    }
  });
  
  if (!response.ok) {
    throw new Error(`Connection failed: HTTP ${response.status}`);
  }
  
  const data = await response.json();
  
  return {
    success: true,
    message: `Connected to OctoPrint ${data.server || 'unknown version'}`,
    data
  };
}

/**
 * Test Klipper connection
 */
async function testKlipperConnection(profile) {
  const apiUrl = profile.apiUrl.replace(/\/$/, '');
  
  const response = await fetch(`${apiUrl}/server/info`, {
    headers: {
      'X-Api-Key': profile.apiKey || ''
    }
  });
  
  if (!response.ok) {
    throw new Error(`Connection failed: HTTP ${response.status}`);
  }
  
  const data = await response.json();
  
  return {
    success: true,
    message: `Connected to Moonraker ${data.result?.moonraker_version || 'unknown version'}`,
    data
  };
}

/**
 * Test PrusaLink connection
 */
async function testPrusaLinkConnection(profile) {
  const apiUrl = profile.apiUrl.replace(/\/$/, '');
  
  const response = await fetch(`${apiUrl}/api/version`, {
    headers: {
      'X-Api-Key': profile.apiKey
    }
  });
  
  if (!response.ok) {
    throw new Error(`Connection failed: HTTP ${response.status}`);
  }
  
  const data = await response.json();
  
  return {
    success: true,
    message: `Connected to PrusaLink ${data.server || 'unknown version'}`,
    data
  };
}

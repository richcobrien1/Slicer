const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // File dialogs
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  saveFile: (defaultName) => ipcRenderer.invoke('dialog:saveFile', defaultName),
  
  // File system operations
  readFile: (filePath) => ipcRenderer.invoke('fs:readFile', filePath),
  writeFile: (filePath, data) => ipcRenderer.invoke('fs:writeFile', filePath, data),
  
  // App info
  getVersion: () => ipcRenderer.invoke('app:getVersion'),
  getPath: (name) => ipcRenderer.invoke('app:getPath', name),
  
  // Shell operations
  showItemInFolder: (fullPath) => ipcRenderer.invoke('shell:showItemInFolder', fullPath),
  openExternal: (url) => ipcRenderer.invoke('shell:openExternal', url),
  
  // Print
  print: (data) => ipcRenderer.invoke('dialog:print', data),
  
  // Updates
  checkForUpdates: () => ipcRenderer.invoke('app:checkForUpdates'),
  
  // Slicer integration
  launchSlicer: (options) => ipcRenderer.invoke('slicer:launch', options),
  
  // USB printer
  sendToUSBPrinter: (options) => ipcRenderer.invoke('printer:sendUSB', options),
  
  // Platform detection
  platform: process.platform,
  isElectron: true
});

console.log('Electron preload script loaded');
console.log('Platform:', process.platform);

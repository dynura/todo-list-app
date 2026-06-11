const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  minimizeApp: () => ipcRenderer.send('window-minimize'),
  maximizeApp: () => ipcRenderer.send('window-maximize'),
  closeApp: () => ipcRenderer.send('close-app')
});
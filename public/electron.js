const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: 'Stay Organized!',
    width: 400,
    height: 400,
    minWidth: 400,
    minHeight: 400,
    maxWidth: 600,
    maxHeight: 600,
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: false,
        contextIsolation: true,
    },
  });

  mainWindow.setMenuBarVisibility(false);

  const startUrl = url.format({
    pathname: path.join(__dirname, '../build/index.html'),
    protocol: 'file:',
    slashes: true,
  });

  mainWindow.loadURL(startUrl);
}

app.whenReady().then(createMainWindow);

// IPC Listeners linked directly to frontend window function calls
ipcMain.on('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('window-maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize(); 
      mainWindow.setSize(400, 400); 
    } else {
      mainWindow.maximize(); 
    }
  }
});

ipcMain.on('close-app', () => {
    app.quit();
});
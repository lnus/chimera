const { app, BrowserWindow } = require('electron');
const path = require('node:path');
const { fork } = require('child_process');

// TODO: Fix menu, lol, whatever for now though

// Check if we're running on macOS
const isMac = process.platform === 'darwin';

// Check if the app is running in development mode
const isDev = process.env.NODE_ENV !== 'production';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

// Start express server
fork(path.join(__dirname, 'server.js'));

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    // Random values for now (I will probably fix this later)
    width: 1280,
    height: 720,

    // Pass preload script to the renderer
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // If in development mode, open the DevTools.
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
};

// Calls when Electron has finished initialization and is ready to create browser windows.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // Respect Cmd + Q on macOS
  if (isMac) {
    return;
  }

  app.quit();
});

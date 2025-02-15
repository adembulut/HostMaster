const { BrowserWindow } = require('electron');
const path = require('path');

function createMainWindow(rootPath) {
    let mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        alwaysOnTop: false,
        skipTaskbar: false,
        darkTheme: true,
        maximizable: false,
        fullscreen: false,
        fullscreenable: false,
        title: 'HostMaster',
        webPreferences: {
            zoomFactor: 1,
            nodeIntegration: false,
            contextIsolation: true,
            allowRunningInsecureContent: false,
            preload: path.join(rootPath, 'preload.js')
        }
    });

    mainWindow.loadFile(path.join(rootPath, 'pages/index.html'));
    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

function createAboutWindow(rootPath, mainWindow) {
    let aboutWindow = new BrowserWindow({
        width: 300,
        height: 300,
        modal: true,
        show: false,
        parent: mainWindow,
        webPreferences: {
            nodeIntegration: true
        }
    });

    aboutWindow.loadFile(path.join(rootPath, 'pages/about.html'));
    aboutWindow.once('ready-to-show', () => {
        aboutWindow.show();
    });
}

module.exports = { createMainWindow, createAboutWindow };

const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const { createMainWindow } = require('./services/windowService');
const { createAboutWindow } = require('./services/windowService');
const { setAppMenu } = require('./services/menuService');
const { setupIpcMain } = require('./services/fileService');

let __rootPath = path.join(__dirname, '../../');

app.whenReady().then(() => {
    createMainWindow(__rootPath);
    setAppMenu(createAboutWindow, __rootPath);

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow(__rootPath);
        }
    });
});

setupIpcMain();

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

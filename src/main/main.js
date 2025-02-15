const {app, BrowserWindow, Menu} = require('electron');
const path = require('path');
const {createMainWindow} = require('./services/windowService');
const {createAboutWindow} = require('./services/windowService');
const {setAppMenu} = require('./services/menuService');
const ipcService = require('./services/ipcService');

let __rootPath = path.join(__dirname, '../../');
let __staticPath = path.join(__dirname, '../../src/static');

app.whenReady().then(() => {
    createMainWindow(__rootPath);
    setAppMenu(createAboutWindow, __rootPath);

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow(__rootPath);
        }
    });
});

ipcService.setupIpcMain();

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.dock.setIcon(path.join(__staticPath, 'img/icon.png'));
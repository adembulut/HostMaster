const {app, BrowserWindow,Menu, ipcMain} = require('electron');
const fs = require('fs');
const path = require('path');
const os = require('os');

let mainWindow;
let aboutWindow;

app.whenReady().then(() => {
    createMainWindow();

    app.dock.setIcon(path.join(__dirname, 'static/img/icon.png'));

    const menuTemplate = [
        {
            label: 'App',
            submenu: [
                {
                    label: 'About',
                    click: () => {
                        createAboutWindow();  // About ekranını aç
                    }
                },
                { type: 'separator' },
                { label: 'Quit', role: 'quit' }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });

});
function createMainWindow(){
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        alwaysOnTop: false,
        skipTaskbar: false,
        darkTheme: true,
        maximizable: false,
        fullscreen: false,
        fullscreenable: false,
        title: 'Adem DnsEdit',
        webPreferences: {
            zoomFactor: 1,
            nodeIntegration: false,
            contextIsolation: true,
            allowRunningInsecureContent: false,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadFile('index.html').then(r => {
        console.log("Page loaded!")
    });
    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}
function createAboutWindow() {
    aboutWindow = new BrowserWindow({
        width: 300,
        height: 300,
        modal: true,
        show: false,
        parent: mainWindow,
        webPreferences: {
            nodeIntegration: true
        }
    });

    aboutWindow.loadFile(path.join(__dirname, 'pages/about.html'));
    aboutWindow.once('ready-to-show', () => {
        aboutWindow.show();
    });
}

ipcMain.handle('read-file', async (event, filePath) => {
    try {
        const fileRealPath = path.join(filePath);
        if (!fs.existsSync(fileRealPath)) {
            return {error: 'File not found!'}
        }
        return fs.readFileSync(fileRealPath, 'utf-8');
    } catch (error) {
        return {error: error.message};
    }
});

ipcMain.handle('write-file', async (event, filePath, data) => {
    try {
        const fileRealPath = path.join(filePath);

        const backupDir = path.join(os.homedir(), ".dnsedit");
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, {recursive: true}); // create if not exist
        }

        if (fs.existsSync(fileRealPath)) {
            const fileName = path.basename(fileRealPath);
            const currentTime = new Date().toISOString().replace(/[-T:.Z]/g, "_");
            const backupFileName = `${fileName.split('.')[0]}_${currentTime}.${fileName.split('.')[1]}`;

            const backupFilePath = path.join(backupDir, backupFileName);
            fs.copyFileSync(fileRealPath, backupFilePath);
        }
        fs.writeFileSync(fileRealPath, data, 'utf-8');

        return {success: true, message: "The file was successfully written and backed up if existed."};
    } catch (error) {
        return {success: false, error: error.message};
    }
});


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

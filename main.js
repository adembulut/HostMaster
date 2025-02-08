const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const os = require('os');

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        alwaysOnTop:true,
        skipTaskbar:false,
        icon:'static/img/icon.png',
        darkTheme:true,
        maximizable:false,
        fullscreen:false,
        fullscreenable:false,
        title:'Adem DnsEdit',
        webPreferences: {
            zoomFactor: 1,
            nodeIntegration: false,
            contextIsolation: true,
            allowRunningInsecureContent:false,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadFile('index.html');
    mainWindow.webContents.openDevTools();  // DevTools'u aç

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});

// JSON dosyasını oku
ipcMain.handle('read-file', async (event, filePath) => {
    try {
        const fileRealPath = path.join(filePath);
        if (!fs.existsSync(fileRealPath)) throw new Error("Dosya bulunamadı!");
        return fs.readFileSync(fileRealPath, 'utf-8');
    } catch (error) {
        return { error: error.message };
    }
});

ipcMain.handle('write-file', async (event, filePath, data) => {
    try {
        const fileRealPath = path.join(filePath);

        // Yedekleme için dizini belirle
        const backupDir = path.join(os.homedir(), ".dnsedit");
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true }); // ~/.dnsedit yoksa oluştur
        }

        // Dosya mevcutsa, yedekleme yap
        if (fs.existsSync(fileRealPath)) {
            const fileName = path.basename(fileRealPath);
            const currentTime = new Date().toISOString().replace(/[-T:.Z]/g, "_"); // ISO formatını al ve uygun hale getir
            const backupFileName = `${fileName.split('.')[0]}_${currentTime}.${fileName.split('.')[1]}`;

            // Yedeği oluştur
            const backupFilePath = path.join(backupDir, backupFileName);
            fs.copyFileSync(fileRealPath, backupFilePath); // Dosyayı yedekle
        }

        // Yeni dosyayı yaz
        fs.writeFileSync(fileRealPath, data, 'utf-8');

        return { success: true, message: "The file was successfully written and backed up if existed." };
    } catch (error) {
        return { success: false, error: error.message };
    }
});




app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

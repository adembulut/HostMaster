const os = require('os');
const {ipcMain} = require("electron");
const path = require("path");
const fs = require("fs");

const setupIpc = () => {
    ipcMain.handle('read-file', async (event, filePath) => {
        try {
            const fileRealPath = path.join(filePath);
            if (!fs.existsSync(fileRealPath)) {
                return {error: 'File not found!'};
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
                fs.mkdirSync(backupDir, {recursive: true});
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
}

module.exports = {
    setupIpcMain:setupIpc
};
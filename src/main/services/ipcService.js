const ipcFile = require('./ipc/ipc-file')

function setupIpcMain() {
    ipcFile.setupIpcMain();
}

module.exports = {setupIpcMain};

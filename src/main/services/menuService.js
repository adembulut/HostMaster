const { Menu } = require('electron');

function setAppMenu(createAboutWindow, rootPath) {
    const menuTemplate = [
        {
            label: 'App',
            submenu: [
                {
                    label: 'About',
                    click: () => createAboutWindow(rootPath)
                },
                { type: 'separator' },
                { label: 'Quit', role: 'quit' }
            ]
        },
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                { role: 'delete' },
                { type: 'separator' },
                { role: 'selectAll' }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
}

module.exports = { setAppMenu };

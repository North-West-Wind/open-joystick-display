require('events').EventEmitter.defaultMaxListeners = 99;

// Setup remote for controller calls
// TODO: migrate to ipcRenderer and ipcMain instead
require('@electron/remote/main').initialize();
const { app, BrowserWindow } = require('electron');
let mainWindow;

// Fixes it for Windows 10, noticed much more stable performance in OBS Linux as well.
app.disableHardwareAcceleration();

function createWindow() {

    global.sharedObject = { argv: process.argv }

    if (process.platform === "win32") {
        cwd = __dirname.replace('app\\js', '');
        ico = cwd + "app/icons/icon.png";
    } else if (process.platform === "darwin") {
        cwd = __dirname.replace('app/js', '');
        ico = cwd + "app/icons/icon.icns";
    } else {
        cwd = __dirname.replace('app/js', '');
        ico = cwd + "app/icons/icon.png";
    }

    const windowConfig = {
        icon: ico,
        width: 320,
        height: 200,
        x: 0,
        y: 0,
        minWidth: 50,
        minHeight: 50,
        menu: null,
        toolbar: false,
        minimizable: false,
        fullscreen: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        },
        transparent: true
    };

    mainWindow = new BrowserWindow(windowConfig);
    mainWindow.setMenu(null);
    // Enable the remote module
    // TODO: use ipcRenderer and ipcMain instead
    require("@electron/remote/main").enable(mainWindow.webContents);

    mainWindow.loadFile('app/views/index.view.html');
    mainWindow.webContents.openDevTools();

}

app.on('ready', () => setTimeout(createWindow, 300));

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});




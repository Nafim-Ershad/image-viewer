const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

require('@electron/remote/main').initialize();

const isMac = process.platform === 'darwin';
const isWin = process.platform === 'win32';
const isDev = process.env.NODE_ENV !== 'production';

let mainWindow;

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false, // Borderless
        // fullscreen: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        autoHideMenuBar: true
    });

    require('@electron/remote/main').enable(mainWindow.webContents);

    mainWindow.loadFile(path.join(__dirname, 'views/index.html'))
        .then(() => {
            loadImagesFromDirectory(path.join(__dirname, "pictures"));
        });
    mainWindow.setMenuBarVisibility(false); // Ensure the menu bar is hidden

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

// App Controls
function closeApp(){
    app.quit();
}

function maximizeApp(){
    if(mainWindow){
        if (mainWindow.isMaximized()) {
            mainWindow.unmaximize();
        } else {
            mainWindow.maximize();
        }
    }
}

function minimizeApp(){
    if (mainWindow) {
        mainWindow.minimize();
    }
}

function toggleDevTools(){
    if(mainWindow){
        const focusedWindow = BrowserWindow.getFocusedWindow();
        if(focusedWindow && isDev){
            focusedWindow.toggleDevTools();
        }
    }
}

function showAppVersion(){
    if(mainWindow){
        dialog.showMessageBox(mainWindow, {
            type: 'info',
            title: 'App Version',
            message: `Version: ${app.getVersion()}\nAuthor: Nafim Ershad Inan`
        });
    }
}

function browseImageFolder() {
    dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
    }).then(result => {
        if (!result.canceled && result.filePaths.length > 0) {
            loadImagesFromDirectory(result.filePaths[0]);
        }
    }).catch(err => {
        console.error('Failed to open directory:', err);
    });
}

// IPC listeners
ipcMain.on('close-app', closeApp);
ipcMain.on('minimize-app', minimizeApp);
ipcMain.on('maximize-app', maximizeApp);
ipcMain.on('toggle-devtools', toggleDevTools);
ipcMain.on('show-app-version', showAppVersion);
ipcMain.on('browse-image-folder', browseImageFolder); // Add this line

app.on('window-all-closed', function () {
    if (!isMac) {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createMainWindow();
    }
});

function loadImagesFromDirectory(directoryPath) {
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error('Could not list the directory.', err);
            return;
        }
        
        const imageFiles = files.filter(file => /\.(jpg|jpeg|png)$/i.test(file));
        const imagePaths = imageFiles.map(file => path.join(directoryPath, file));

        mainWindow.webContents.send('load-images', imagePaths);
    });
}

app.on('ready', () => {
    createMainWindow();
});

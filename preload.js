const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('appControls', {
    closeApp: () => ipcRenderer.send('close-app'),
    minimizeApp: () => ipcRenderer.send('minimize-app'),
    maximizeApp: () => ipcRenderer.send('maximize-app'),
    toggleDevTools: () => ipcRenderer.send('toggle-devtools'),
    showAppVersion: () => ipcRenderer.send('show-app-version'),
    browseImageFolder: () => ipcRenderer.send('browse-image-folder') // Add this line
});

contextBridge.exposeInMainWorld('images', {
    onReceiveImages: (callback) => ipcRenderer.on('load-images', (event, imagePaths) => callback(imagePaths))
});
const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld('electronAPI', {
    setSize: (size) => ipcRenderer.send('set-size', size),
    getScreenId: (callback) => ipcRenderer.on('SET_SOURCE_ID', callback)
});
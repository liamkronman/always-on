const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
	setSize: (size) => ipcRenderer.send("set-size", size),
	getScreenId: (callback) => {
		ipcRenderer.removeAllListeners("SET_SOURCE_ID");
		ipcRenderer.on("SET_SOURCE_ID", callback);
	},
    setCursorInfo: (cursorInfo) => ipcRenderer.send("setCursorInfo", cursorInfo),
    onSetCursorInfo: (callback) => {
        ipcRenderer.removeAllListeners("setCursorInfo");
        ipcRenderer.on("setCursorInfo", callback);
    },
    setMenu: (menu) => ipcRenderer.send("setMenu", menu),
});

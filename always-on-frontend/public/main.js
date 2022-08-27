const {
	app,
	BrowserWindow,
	desktopCapturer,
	ipcMain,
	Menu,
} = require("electron");
const path = require("path");

let availableScreens;
let mainWindow;
let overlayWindow;

const sendSelectedScreen = (id) => {
	mainWindow.webContents.send("SET_SOURCE_ID", id);
};

const createTray = () => {
    let checkedId = availableScreens[0].id;
	const screensMenu = availableScreens.map((item) => {
		return {
			label: item.name,
			click: () => {
				sendSelectedScreen(item.id);
                checkedId = item.id;
			},
            type: 'radio',
            checked: item.id === checkedId
		};
	});

    const baseTemplate = [{
        label: app.name,
        submenu: [{ role: "quit" }],
    },
    {
        label: "Application",
        submenu: [
            {
                label: "About Application",
                selector: "orderFrontStandardAboutPanel:",
            },
            { type: "separator" },
            {
                label: "Quit",
                accelerator: "Command+Q",
                click: function () {
                    app.quit();
                },
            },
        ],
    },
    {
        label: "Edit",
        submenu: [
            { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
            { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
            { type: "separator" },
            { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
            { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
            { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
            {
                label: "Select All",
                accelerator: "CmdOrCtrl+A",
                selector: "selectAll:",
            },
        ],
    }];
	const baseMenu = Menu.buildFromTemplate(baseTemplate), menuWithScreens = Menu.buildFromTemplate([...baseTemplate, {
        label: "Screens",
        submenu: screensMenu,
    }]);

    Menu.setApplicationMenu(baseMenu);

    ipcMain.on("setMenu", (event, menu) => {
        Menu.setApplicationMenu(menu ? menuWithScreens : baseMenu);
        if (menu) sendSelectedScreen(checkedId);
    });
};

const createWindow = () => {
	overlayWindow = new BrowserWindow({
		frame: false,
		autoHideMenuBar: true,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration: true,
		},
		transparent: true,
		alwaysOnTop: true,
		focusable: false,
		simpleFullscreen: true,
		fullscreen: true,
	});
	overlayWindow.setIgnoreMouseEvents(true);
	// ^^ will cause issues; we only want to ignore lcicks

	overlayWindow.loadURL("http://localhost:4000/overlay");

	// Open the DevTools.
	// overlayWindow.webContents.openDevTools();

	// cursor sending
	ipcMain.on("setCursorInfo", (event, arg) =>
		overlayWindow.webContents.send("setCursorInfo", arg)
	);

	mainWindow = new BrowserWindow({
		show: false,
		width: 500,
		height: 800,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
		},
	});

	ipcMain.on("set-size", (event, size) => {
		const { width, height } = size;
		try {
			mainWindow.setSize(width, height, true);
		} catch (e) {
			console.log(e);
		}
	});

	mainWindow.loadURL("http://localhost:4000/");

	mainWindow.once("ready-to-show", () => {
		mainWindow.show();
		mainWindow.setPosition(0, 0);

		desktopCapturer
			.getSources({
				types: ["window", "screen"],
			})
			.then((sources) => {
				availableScreens = sources;
				createTray();
			});
	});

	// mainWindow.webContents.openDevTools();
};

app.on("ready", () => {
	createWindow();
});

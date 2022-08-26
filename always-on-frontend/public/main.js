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

const sendSelectedScreen = (item) => {
	mainWindow.webContents.send("SET_SOURCE_ID", item.id);
};

const createTray = () => {
	const screensMenu = availableScreens.map((item) => {
		return {
			label: item.name,
			click: () => {
				sendSelectedScreen(item);
			},
		};
	});

	const menu = Menu.buildFromTemplate([
		{
			label: app.name,
			submenu: [{ role: "quit" }],
		},
		{
			label: "Screens",
			submenu: screensMenu,
		},
	]);

	Menu.setApplicationMenu(menu);
};

const createWindow = () => {
	mainWindow = new BrowserWindow({
		show: false,
		width: 800,
		height: 600,
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

	mainWindow.webContents.openDevTools();

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
};

app.on("ready", () => {
	createWindow();
});

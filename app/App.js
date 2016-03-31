'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const querystring = require('querystring');
const VKController = require('./src/js/VKController.js');
const AppTray = require('./AppTray.js');
const ipc = electron.ipcMain;

let mainWindow;
let dialogWindow;
let loginWindow;
let vk;
let updateTimeout;
let tray;


app.on('ready', onReady);
app.on('window-all-closed', quit);

app.on('activate', function () {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow();
	}
});

function onReady () {

	tray = new AppTray();
	vk = new VKController();

	// Create the browser window.
	mainWindow = new BrowserWindow({width: 800, height: 600, center: true, /*autoHideMenuBar: true,*/ maximizable: true, resizable: true, show: false});

	loginWindow = new BrowserWindow({ center: true, autoHideMenuBar: true, maximizable: false, resizable: false, show: false });
	loginWindow.loadURL(vk.config.authURL);
	loginWindow.webContents.on('did-get-redirect-request', (e, oldURL, newURL) => {
			if(newURL.search('https://oauth.vk.com/blank.html') != -1){
				let data = querystring.parse(newURL.substring(newURL.indexOf('#') + 1));
				vk.login(data);
				mainWindow.loadURL('file://' + __dirname + '/src/index.html');
			}/* else {
				loginWindow.show();
			}*/
	});

	tray.on('onClickExit', quit);

	vk.on('onInit', () => mainWindow.show());
	vk.on('onLoadedFriends', friends => {
		mainWindow.webContents.send('onLoadedFriends', {friends: friends});
	});

	vk.on('onLoadedStatusFriends', friends => {
		mainWindow.webContents.send('onLoadedStatusFriends', {friends: friends});
	});

	mainWindow.webContents.on('did-finish-load', onLoadedMainWindow);

	mainWindow.webContents.openDevTools();

}

function onLoadedMainWindow () {
	vk.loadFriends();

	update();
}

function update() {
	//вернуть пользователей
	//проверить новые сообщения
	//mainWindow.webContents.send('update', {});
	try {
		vk.loadStatusFriends();

		clearUpdateTimeout();

		updateTimeout = setTimeout(update, 2000);
	} catch(e) {
		console.error(e.message);
	}
}

function clearUpdateTimeout() {
	if(updateTimeout){
		clearTimeout(updateTimeout);
		updateTimeout = null;
	}
}

function quit() {

	clearUpdateTimeout();

	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
}
'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const querystring = require('querystring');

let mainWindow;
let dialogWindow;
let loginWindow;

function onReady () {
	
	// Create the browser window.
	mainWindow = new BrowserWindow({width: 800, height: 600, center: true, autoHideMenuBar: true, maximizable: false, resizable: false});
	mainWindow.loadURL('file://' + __dirname + '/src/index.html');

	// Open the DevTools.
	//mainWindow.webContents.openDevTools();


}


app.on('ready', onReady);

app.on('window-all-closed', function () {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', function () {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow();
	}
});

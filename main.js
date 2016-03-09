'use strict';

const electron = require('electron');
const querystring = require('querystring');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {
	// Create the browser window.
	mainWindow = new BrowserWindow({width: 800, height: 600});

	// and load the index.html of the app.
	mainWindow.loadURL('file://' + __dirname + '/index.html');

	// Open the DevTools.
	// mainWindow.webContents.openDevTools();

	// Emitted when the window is closed.
	mainWindow.on('closed', function() {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null;
	});

	auth();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
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


function auth(){

	var authWindow = new BrowserWindow({width: 800, height: 600}),
		webContents = authWindow.webContents;

	authWindow.loadURL('https://oauth.vk.com/authorize?client_id=5329877&display=popup&redirect_uri=https://oauth.vk.com/blank.html&scope=friends&response_type=token&v=5.45');

	webContents.on('did-get-redirect-request', function(e, oldURL, newURL, a, v, d){

		if(newURL.search('https://oauth.vk.com/blank.html') != -1){
			authWindow.close();
			var data = querystring.parse(newURL.substring(newURL.indexOf('#') + 1));

			console.log('access_token - ' + data.access_token)
			console.log('expires_in - ' + data.expires_in)
			console.log('user_id - ' + data.user_id)
		}

	});
}
'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const querystring = require('querystring');
const VKController = require('./src/js/VKController.js');
const ipc = electron.ipcMain;

let mainWindow;
let dialogWindow;
let loginWindow;
let vk;

function onReady () {

	vk = new VKController();

	// Create the browser window.
	mainWindow = new BrowserWindow({width: 800, height: 600, center: true, /*autoHideMenuBar: true,*/ maximizable: true, resizable: true, show: false});
	mainWindow.loadURL('file://' + __dirname + '/src/index.html');

	loginWindow = new BrowserWindow({ center: true, autoHideMenuBar: true, maximizable: false, resizable: false, show: false });
	loginWindow.loadURL(vk.config.authURL);
	loginWindow.webContents.on('did-get-redirect-request', (e, oldURL, newURL) => {
			if(newURL.search('https://oauth.vk.com/blank.html') != -1){
				let data = querystring.parse(newURL.substring(newURL.indexOf('#') + 1));
				vk.login(data);
			}/* else {
				loginWindow.show();
			}*/
	});

	vk.on('onInit', () => mainWindow.show());
	vk.on('onLoadedFiends', friends => {
		mainWindow.webContents.send('init', {friends: friends});
	});

	ipc.on('mainLoaded', () => console.log('mainLoaded'));
	ipc.on('getFriends', () => vk.loadFriends());

	// Open the DevTools.
	mainWindow.webContents.openDevTools();

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

function update() {

}

// VKController.prototype.login = function() {

// 	var authWindow = new BrowserWindow({ center: true, autoHideMenuBar: true, maximizable: false, resizable: false }),
// 		webContents = authWindow.webContents,
// 		_this = this;

// 	authWindow.loadURL(this.config.authURL);

// 	webContents.on('did-get-redirect-request', function(e, oldURL, newURL, a, v, d){

// 		if(newURL.search('https://oauth.vk.com/blank.html') != -1){
// 			authWindow.close();
// 			var data = querystring.parse(newURL.substring(newURL.indexOf('#') + 1));
// 			this.onLogin(data);
// 		}

// 	}.bind(this));
// };
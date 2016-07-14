'use strict'

const {app, Menu, Tray} = require('electron');
const path = require('path');
const EventEmitter = require('events');
let trayIcon = null;

/*if (process.platform === 'darwin') {
	trayIcon = new Tray(path.join(__dirname, 'img/tray-iconTemplate.png'));
}
else {
	trayIcon = new Tray(path.join(__dirname, 'img/tray-icon-alt.png'));
}

var trayMenuTemplate = [
	{
		label: 'Sound machine',
		enabled: false
	},
	{
		label: 'Settings',
		click: function () {
			ipc.send('open-settings-window');
		}
	},+
	{
		label: 'Quit',
		click: function () {
			ipc.send('close-main-window');
		}
	}
];
var trayMenu = Menu.buildFromTemplate(trayMenuTemplate);
trayIcon.setContextMenu(trayMenu);*/


function AppTray (){

	EventEmitter.call(this);

	trayIcon = new Tray('./resources/tray/icon.png');

	var contextMenu = Menu.buildFromTemplate([
		{ label: 'Друзья', click: () => this.emit('onClickFriends')},
		{ label: 'Выйти', click: () => this.emit('onClickExit')},
	]);

	trayIcon.setToolTip('VK.Dialogs');
	trayIcon.setContextMenu(contextMenu);

	//trayIcon.setImage('./resources/tray/icon-new-message.png')
}

AppTray.prototype = Object.create(EventEmitter.prototype);

module.exports = AppTray;

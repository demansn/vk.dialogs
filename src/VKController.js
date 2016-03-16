module.exports = VKController;

var remote = require('remote');
var VK = require('vksdk');
var querystring = require('querystring');
var EventEmitter = require('events');
var BrowserWindow = remote.require('browser-window');

function VKController() {

	EventEmitter.call(this)

	this.vk = new VK({
		'appId'     : this.config.id,
		'appSecret' : this.config.secret,
		'mode'      : 'oauth'
	});

	this.vk.setSecureRequests(true);
	this.vk.on('tokenByCodeReady', function() { });
	this.vk.on('tokenByCodeNotReady', function(e) {
		// обрабатываем ошибку установки токена 
		console.dir(e);
		console.log('tokenByCodeNotReady');
	});
	
/*	this.vk.request('messages.getDialogs', {'uids' : this.config.user_id}, function(e) {
		console.dir(e.response.items);
		var div = document.createElement('div')
		document.body.appendChild(div);
	});*/

}

VKController.prototype = Object.create(EventEmitter.prototype);
VKController.constructor = VKController;

VKController.prototype.config = {
				id: 5329877,
				secret: 'SNY83LI0pH56lWZqB3R5',
				access_token: null,
				expires_in: null,
				user_id: null,
				authURL: 'https://oauth.vk.com/authorize?client_id=5329877&display=popup&redirect_uri=https://oauth.vk.com/blank.html&scope=messages,friends&response_type=token&v=5.45'
			};

VKController.prototype.init = function(data){

	this.config.access_token = data.access_token;
	this.config.expires_in = data.expires_in;
	this.config.user_id = data.user_id;

	this.vk.setToken( this.config.access_token );

	this.emit('onInit');
};

VKController.prototype.login = function() {

	var authWindow = new BrowserWindow({ center: true, autoHideMenuBar: true, maximizable: false, resizable: false }),
		webContents = authWindow.webContents,
		_this = this;

	authWindow.loadURL(this.config.authURL);

	webContents.on('did-get-redirect-request', function(e, oldURL, newURL, a, v, d){

		if(newURL.search('https://oauth.vk.com/blank.html') != -1){
			authWindow.close();
			var data = querystring.parse(newURL.substring(newURL.indexOf('#') + 1));
			this.onLogin(data);
		}

	}.bind(this));
};

VKController.prototype.onLogin = function(data) {

	this.emit('onLogin', data);
	this.init(data);

};

VKController.prototype.loadFriends = function() {
	this.vk.request('friends.get', {'user_id' : this.config.user_id, order: 'hints', fields: 'photo_50,online'}, 
		function(e) {
			this.emit('onLoadedFiends', e.response.items);
		}.bind(this)
	);
};

VKController.prototype.loadMessagesByUser = function(prop) {
	this.vk.request('messages.getHistory', prop, 
		function(e) {
			this.emit('onLoadedMessages', e.response.items);
		}.bind(this)
	);
};

VKController.prototype.sendMessageByUser = function(prop) {
	this.vk.request('messages.send', prop, 
		function(e) {
			this.emit('onSendedMesage', e.response);
		}.bind(this)
	);
};


var remote = require('remote');
var VK = require('vksdk');
var querystring = require('querystring');
var level = require('level');
var BrowserWindow = remote.require('browser-window')
var currentWindow = remote.getCurrentWindow();


function App(window){

	this.window = window;

	this.db = level('./db');

	this.vkData = {
				id: 5329877,
				secret: 'SNY83LI0pH56lWZqB3R5',
				access_token: null,
				expires_in: null,
				user_id: null 
			};

	this.vk = new VK({
		'appId'     : this.vkData.id,
		'appSecret' : this.vkData.secret,
		'mode'      : 'oauth'
	});

	this.init();

}

App.prototype.vkData = {};

App.prototype.init = function(callback){
	this.db.get('vkData', {valueEncoding: 'json'}, function(e, data){

		if(e) {
			if(e.notFound) {
				this.authorizationToVk();
				return;
			}

			console.log(e.message);
			return;
		}

		this.setVkUserData(data);
		this.intiVk();
	}.bind(this));
};

App.prototype.setVkUserData = function(data){
	this.vkData.access_token = data.access_token;
	this.vkData.expires_in = data.expires_in;
	this.vkData.user_id = data.user_id;
};

App.prototype.authorizationToVk = function(){

	var authWindow = new BrowserWindow({ center: true, autoHideMenuBar: true, maximizable: false, resizable: false }),
		webContents = authWindow.webContents,
		_this = this;

	authWindow.loadURL('https://oauth.vk.com/authorize?client_id=5329877&display=popup&redirect_uri=https://oauth.vk.com/blank.html&scope=messages&response_type=token&v=5.45');

	webContents.on('did-get-redirect-request', function(e, oldURL, newURL, a, v, d){

		if(newURL.search('https://oauth.vk.com/blank.html') != -1){
			authWindow.close();
			var data = querystring.parse(newURL.substring(newURL.indexOf('#') + 1));
			var dbOptions = [{
				type          : 'put',
				key           : 'vkData',
				value         : data,
				keyEncoding   : 'binary',
				valueEncoding : 'json'
			}];

			_this.db.batch(dbOptions, function(e){

				if(e){
					console.log(e.message);
					return;
				}

				_this.setVkUserData(data);
				_this.intiVk();
			});
		}

	});

};

App.prototype.intiVk = function(){

	this.vk.setSecureRequests(true);
	this.vk.on('tokenByCodeReady', function() { });
	this.vk.on('tokenByCodeNotReady', function(e) {
		// обрабатываем ошибку установки токена 
		console.dir(e);
		console.log('tokenByCodeNotReady');
	});
	this.vk.setToken( this.vkData.access_token );
	this.vk.request('messages.getDialogs', {'uids' : this.vkData.user_id}, function(e) {
		console.dir(e.response.items);
		var div = document.createElement('div')
		document.body.appendChild(div);
	});

};

App.prototype.getAllFriends = function(callback){

};

module.exports = App;
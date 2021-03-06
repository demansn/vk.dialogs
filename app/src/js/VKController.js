module.exports = VKController;

var VK = require('vksdk');
var EventEmitter = require('events');


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

VKController.prototype.login = function(data) {
	this.init(data);
};

VKController.prototype.loadFriends = function() {
	this.vk.request('friends.get', {'user_id' : this.config.user_id, order: 'hints', fields: 'photo_50,online'}, 
		function(e) {
			if(e.error){
				console.error(e.error.error_msg);
				return;
			}

			this.emit('onLoadedFriends', e.response.items);
		}.bind(this)
	);
};

VKController.prototype.getFriends = function(callback) {
	this.vk.request('friends.get', {'user_id' : this.config.user_id, order: 'hints', fields: 'photo_50,online'}, 
		function(e) {
			if(e.error){
				console.error(e.error.error_msg);
				return;
			}

			callback(e.response.items);
		}.bind(this)
	);
};

VKController.prototype.loadStatusFriends = function() {
	this.vk.request('friends.get', {'user_id' : this.config.user_id, order: 'hints', fields: 'online'}, 
		function(e) {
			if(e.error){
				console.error(e.error.error_msg);
				return;
			}

			this.emit('onLoadedStatusFriends', e.response.items);
		}.bind(this)
	);
};

VKController.prototype.loadMessagesByUser = function(prop, callback) {
	this.vk.request('messages.getHistory', prop, 
		function(e) {
			callback.call(this, e.response.items);
		}
	);
};

VKController.prototype.sendMessageByUser = function(prop) {
	this.vk.request('messages.send', prop, 
		function(e) {
			this.emit('onSendedMesage', e.response);
		}.bind(this)
	);
};

VKController.prototype.loadMessage = function(prop) {
	this.vk.request('messages.getById', prop, 
		function(e) {
			this.emit('onLoadedMesage', e.response.items);
		}.bind(this)
	);
};

VKController.prototype.getUser = function(id, callback) {
	this.vk.request('users.get', {'user_id' : id, 'fields': 'photo_50, online'}, 
		function(e) {
			if(e.error){
				console.error(e.error.error_msg);
				return;
			}

			callback(e.response);
		}.bind(this)
	);
};
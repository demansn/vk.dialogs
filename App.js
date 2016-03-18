

var remote = require('remote');
var querystring = require('querystring');
var level = require('level');
var BrowserWindow = remote.require('browser-window');
var VKController = require('./src/VKController');
var currentWindow = remote.getCurrentWindow();

function App(){

	this.vk = new VKController();
	this.db = level('./db');

	this.vk.on('onInit', this.load.bind(this));
	this.vk.on('onLoadedFiends', this.initViewVKFriends.bind(this));
	this.vk.on('onLoadedMessages', this.showMessages.bind(this));
	this.vk.on('onLoadedMesage', this.addMessages.bind(this));
	this.vk.on('onSendedMesage', this.onSendedMesage.bind(this));
	this.vk.on('onLogin', this.initViewVKFriends.bind(this));

	$('#friends').on('click', '.friend', this.onClickFriend.bind(this));
	$('#button-send-message').on('click', this.onClickSendMessage.bind(this));

	this.init();

}

App.prototype.init = function(callback){
	this.db.get('vkData', {valueEncoding: 'json'}, function(e, data){

		if(e) {
			if(e.notFound) {
				this.vk.login();
				return;
			}

			console.log(e.message);
			return;
		}

		this.vk.init(data);

	}.bind(this));
};

App.prototype.load = function() {
	this.vk.loadFriends();
};

App.prototype.saveVkData = function(data){

	var dbOptions = [{
		type          : 'put',
		key           : 'config',
		value         : data,
		keyEncoding   : 'binary',
		valueEncoding : 'json'
	}];

	this.db.batch(dbOptions, function(e){
		if(e){
			console.log(e.message);
			return;
		}
	});

};

App.prototype.initViewVKFriends = function(friends) {

	var div = null, img = null,
		container = document.getElementById('friends'),
		fr;

	for(var i = 0; i < friends.length; i += 1){
		fr = friends[i];
		div = document.createElement('div');
		div.id = fr.id;
		div.className = 'friend';
		div.innerHTML = '<image src=' + fr.photo_50+ ' style="width:50px; height: 50px;" ></image>' + fr.first_name + ' ' + fr.last_name + ' ' + (fr.online ? 'online' : 'offline');
		container.appendChild(div);
	}

};

App.prototype.onClickFriend = function(e) {
	this.loadDialogByUser(e.currentTarget.id);
};

App.prototype.loadDialogByUser = function(userId) {

	if(this.currentUserId){
		$('#' + this.currentUserId).removeClass('selected');
	}

	this.currentUserId = userId;

	$('#' + this.currentUserId).addClass('selected');

	this.vk.loadMessagesByUser({'user_id': userId});

};

App.prototype.showMessages = function(messages) {
	$('#message-list').children().remove();

	var div,
		m;

	for(var i = messages.length - 1; i >= 0; i -= 1){

		m = messages[i];
		div = document.createElement('div');
		div.id = m.id;

		if(m.from_id == this.currentUserId){
			div.className = 'message friend-message';
		} else {
			div.className = 'message owner-message';
		}

		div.innerHTML = m.body;

		$('#message-list').append(div);
	}

};

App.prototype.addMessages = function(messages) {
	var div,
		m;

	for(var i = messages.length - 1; i >= 0; i -= 1){

		m = messages[i];
		div = document.createElement('div');
		div.id = m.id;

		if(m.from_id == this.currentUserId){
			div.className = 'message friend-message';
		} else {
			div.className = 'message owner-message';
		}

		div.innerHTML = m.body;

		$('#message-list').append(div);
	}

};

App.prototype.onClickSendMessage = function() {
	var inp = $('#text-message');
	if(this.currentUserId) {
		this.vk.sendMessageByUser({user_id: this.currentUserId, message: inp.val()});
		inp.val('');
	}
};

App.prototype.onSendedMesage = function(responce) {
	this.vk.loadMessage({message_ids: responce});
};

module.exports = App;
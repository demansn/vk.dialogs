

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
	this.vk.on('onLogin', this.initViewVKFriends.bind(this));

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
	console.dir(friends);
	var div = null, img = null,
		container = document.getElementById('friends'),
		fr;

	for(var i = 0; i < friends.length; i += 1){
		fr = friends[i];
		div = document.createElement('div');
		div.innerHTML = '<image src=' + fr.photo_50+ ' style="width:50px; height: 50px;" ></image>' + fr.first_name + ' ' + fr.last_name + ' ' + (fr.online ? 'online' : 'offline');
		container.appendChild(div);
	}

};

module.exports = App;
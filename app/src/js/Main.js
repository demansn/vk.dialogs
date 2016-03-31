'use strict'

let ipc = require("electron").ipcRenderer;
let FriendsList = require('./FriendsList.js');
let $ = require('./lib/jquery-1.12.1.min.js');

let friendsList = new FriendsList();

ipc.on('onLoadedFriends', function(e, message) {
	friendsList.init(message.friends);
	$('#friendsContainer').append(friendsList.view.render().el);
});

ipc.on('onLoadedStatusFriends', function(e, message) {
	friendsList.update(message.friends);
});
'use strict'

let ipc = require("electron").ipcRenderer;
let FriendsList = require('./FriendsList.js');
let $ = require('./lib/jquery-1.12.1.min.js');

let friendsList = new FriendsList();

ipc.send('getFriends');

ipc.on('init', function(e, message){
	friendsList.init(message.friends);
	$('#friendsContainer').append(friendsList.view.render().el);
})
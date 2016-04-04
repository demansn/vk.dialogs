'use strict'

let ipc = require("electron").ipcRenderer;
let Backbone = require('backbone');
Backbone.$ = require('./lib/jquery-1.12.1.min.js');
let _ = require('underscore');

let userViewTamplate = _.template('<image src="<%= photo_50 %>"></image><div class="name"><%= first_name %> <%= last_name %></div><div class="status"></div>');

let User = Backbone.Model.extend({});
let UsersCollection = Backbone.Collection.extend({
	model: User,
	url: 'friends',
	initialize: function(){

	},
	sync: function(method, model, options) {

		var message = {
				method: method,
				type: model.url,
				callbackChanal: 'read:friends'
			};

		ipc.once(message.callbackChanal, function(e){
			options.success(e);
		});

		ipc.send('sync', message);
	}
});

let FriendsListView = Backbone.View.extend({
	tagName: 'ul',
	className: 'friends-list',
	render: function( ){
		this.collection.each(this.addOne, this);
		return this;
	},
	addOne: function(user){
		var userView = new UserView({model:user});

		userView.on('click', this.onSelectFriend, this);

		this.$el.append(userView.render().el);
	},
	onSelectFriend: function(friendId) {
		this.trigger('onSelectFriend', friendId);
	}
});

let UserView = Backbone.View.extend({
	tagName: 'li',
	className: 'friend',
	events: {
		'click': function(){
			this.trigger('click', this.model.id);
		}
	},
	initialize: function() {
		this.model.on('change:online', this.updateOnlineStatus, this);
	},
	render: function(){

		this.$el.html(userViewTamplate(this.model.toJSON()));
		this.$status = this.$el.find('.status');

		this.updateOnlineStatus();

		return this;
	},
	updateOnlineStatus: function() {

		if(this.model.get('online') > 0){
			this.$status.addClass('online');
		} else {
			this.$status.removeClass('online');
		}

	}
});

let FriendsList = function(){
	this.users = new UsersCollection();
	this.view = new FriendsListView({collection:this.users});

	//this.view.on('onSelectFriend', friendId => this.emit('onSelectFriend', friendId));
}

FriendsList.prototype.init = function() {
	//this.users.add( friends );
	this._update();
};

FriendsList.prototype.update = function( friends ) {

	let friend = null,
		model = null;

	for(let i = 0; i < friends.length; i += 1) {

		friend = friends[i];

		model = this.users.get(friend.id);

		if(model) {
			model.set('online', friend.online);
		} else {
			console.warn('Нет такого пользователя в коллекции ' + friend.id);
		}

	}
};

FriendsList.prototype._update = function() {
	this.users.fetch();
	this.updateTimeout = setTimeout(this._update.bind(this), 5000);
}

module.exports = FriendsList;
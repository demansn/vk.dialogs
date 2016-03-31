'use strict'

let Backbone = require('backbone');
Backbone.$ = require('./lib/jquery-1.12.1.min.js');
let _ = require('underscore');

let userViewTamplate = _.template('<image src="<%= photo_50 %>"></image><div class="name"><%= first_name %> <%= last_name %></div><div class="status"></div>');

let User = Backbone.Model.extend({});
let UsersCollection = Backbone.Collection.extend({
	model: User
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

		this.$el.append(userView.render().el);
	}
});

let UserView = Backbone.View.extend({
	tagName: 'li',
	className: 'friend',
	initialize: function() {
		this.model.on('change:online', this.updateOnlineStatus, this);
		console.log('initialize');

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
}

FriendsList.prototype.init = function( friends ) {
	this.users.add( friends );
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

module.exports = FriendsList;
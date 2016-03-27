'use strict'

let Backbone = require('backbone');
Backbone.$ = require('./lib/jquery-1.12.1.min.js');
let _ = require('underscore');

let userViewTamplate = _.template('<image src="<%= photo_50 %>"></image><div class="name"><%= first_name %> <%= last_name %></div><div class="status offline"></div>');

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
	render: function(){

		this.$el.html(userViewTamplate(this.model.toJSON()));

		if(this.model.get('online')){
			this.$el.find('.status').removeClass('offline');
		}

		return this;
	}
});

let FriendsList = function(){
	this.users = new UsersCollection();
	this.view = new FriendsListView({collection:this.users});
}

FriendsList.prototype.init = function( friends ) {
	this.users.add( friends );
};

module.exports = FriendsList;
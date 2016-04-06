'use strict'

let ipc = require("electron").ipcRenderer;
let Backbone = require('Backbone');
Backbone.$ = require('./lib/jquery-1.12.1.min.js');
let _ = require('underscore');

let dialogTamplate = _.template('<image src="<%= photo_50 %>"></image>');

/*let Dialog = Backbone.Model.extend({

});

let DialogView = Backbone.View.extend({

});

let userViewTamplate = _.template('<image src="<%= photo_50 %>"></image><div class="name"><%= first_name %> <%= last_name %></div><div class="status"></div>');
let userViewTamplate = _.template('<image src="<%= photo_50 %>"></image><div class="name"><%= first_name %> <%= last_name %></div><div class="status"></div>');


// *
//  * title
//  * sendBtn
//  * inputMessge
//  * dialogsCollectionView
//  * messagesCollectionView
 
let WindowModel = Backbone.Model.extend({
	initialize: function(){
		this.dialogsList = new DialogsList();
	}
});

let WindowView = Backbone.View.extend({
	el: function(){
		return document.getElementById('dialogs');
	},
	initialize: function(){
		this.dialogsListView = new DialogsListView(this.model.dialogsList);

	},
	render: function(){

	}
});*/

let Message = Backbone.Model.extend({

});

let MessageView = Backbone.View.extend({
	tagName: 'li',
	className: 'message'
});

let Messages = Backbone.Collection.extend({
	model: Message,
	url: 'messages',
	initialize: function(){
		this.on('add', this.addOne, this);
	}
	sync: function(method, model, options){

		var message = {
				id: options.id,
				method: method,
				type: model.url,
				isChat: options.isChat,
				count: options.count,
				callbackChanal: 'read:messages' + options.id
			};

		ipc.once(message.callbackChanal, function(e, data){

			options.success(data);

		}.bind(this));

		ipc.send('sync', message);

	},
	addOne: function(model) {
		var view = new MessageView({model: model});
	}
});

let MessagesView = Backbone.View.extend({
	tagName: 'ul',
	className: 'messages-list'
});

let Dialog = Backbone.Model.extend({
	url: 'dialog',
	defaults: {
		id: null,
		photo_50: null,
		title: 'dialog',
		messages: null,
		isChat: false,
		online: 0,
		selected: false
	},
	initialize: function() {
		this.set('messages', new Messages());
	},
	sync: function(method, model, options){

		var message = {
				id: this.id,
				method: method,
				type: model.url,
				isChat: this.get('isChat'),
				callbackChanal: 'read:dialog-info'
			};

		ipc.once(message.callbackChanal, function(e, info){
			var fr = info[0],
				modelData = {
					title: fr.first_name + ' ' + fr.last_name,
					online: fr.online,
					photo_50: fr.photo_50
				};

			options.success(modelData);

		}.bind(this));

		ipc.send('sync', message);

	},
	loadNextMessages: function(){
		var data = this.toJSON();

		this.get('messages').fetch({id: data.id, isChat: data.isChat, count: 50});

	}
});

let DialogView = Backbone.View.extend({
	tagName: 'li',
	className: 'dialog',
	events: {
		'click': ''
	},
	initialize: function() {
		this.model.on('sync', this.render, this);
	},
	render: function(){
		this.$el.html(dialogTamplate(this.model.toJSON()));
		return this;
	}
});

let Dialogs = Backbone.Collection.extend({
	model: Dialog,
});

let DialogsView = Backbone.View.extend({
	tagName: 'ul',
	className: 'dialogs-list',
	initialize: function() {
		this.collection.on('add', this.addOne, this);
	},
	render: function(){
		this.$el.childer.remove();
		this.collection.each(this.addOne, this);

		return this;
	},
	addOne: function(model) {
		var view = new DialogView({model: model});

		this.$el.append(view.el);
	}
});

let WindowModel = Backbone.Model.extend({
	defaults: {
		title: 'dialog title',
		dialogs: null
	}
});

let WindowView = Backbone.View.extend({
	el: function(){
		return document.getElementById('dialogs');
	},
	initialize: function(){
		this.$title = this.$el.find('#dialog-title');
		this.$inputMessage = this.$el.find('#input-message');
		this.dialogsView = new DialogsView({collection : this.collection});
		this.messagesView = new MessagesView();
	},
	render: function(){

		this.$title.html(this.model.get('title'));
		this.$el.append(this.dialogsView.el);

	}
});

function DialogsManger() {
	this.model = new WindowModel();
	this.dialogs = new Dialogs()
	this.view = new WindowView({model:this.model, collection: this.dialogs});

	this.view.render();

	ipc.on('openByFriend', (e, id) => this.openByFriend(id));
	ipc.on('openByChat', (e, id) => this.openByChat(id));
}

DialogsManger.prototype.openByFriend = function( frId ) {
	var d = new Dialog({id: frId});
	this.dialogs.add(d);
	d.fetch();
	d.loadNextMessages();
};

DialogsManger.prototype.openByChat = function( chId ) {
	var d = new Dialog({id: frId, isChat: true});
};

DialogsManger.prototype.onSelect = function( id ) {

};

module.exports = DialogsManger;
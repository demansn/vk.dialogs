'use strict'

let Backbone = require('Backbone');
Backbone.$ = require('./lib/jquery-1.12.1.min.js');
let _ = require('underscore');

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

let WindowModel = Backbone.Model.extend({
	initialize: function(){
		//this.dialogsList = new DialogsList();
	}
});

let WindowView = Backbone.View.extend({
	el: function(){
		return document.getElementById('dialogs');
	},
	events: {
		'click #send-btn': this.onClickSend
	},
	initialize: function(){
		this.$title = this.$el.fing('#dialog-title');
		this.$inputMessage = this.$el.fing('#input-message');
		//this.dialogsListView = new DialogsListView(this.model.dialogsList);

	},
	render: function(){

	},
	onClickSend: function(){

	}
});

function DialogsManger() {
	this.model = new WindowModel();
	this.view = new WindowView(this.model);
}

module.exports = DialogsManger;
Backbone.sync = function(method, model, options) {
	var message = {
			mehod: method,
			type: model.url,
			id: model.id,

		}
	//var store = model.localStorage || model.collection.localStorage;
	//
	chanal = method + ':' + model.url + ':' + model.id;
	ipc.once(chanal, options.success);

	switch (method) {
		case "read":  
			
			break;
		case "create":
			//ipc.send(chanal);
			break;
		case "update":
			//ipc.send(chanal);
			break;
		case "delete":
			//ipc.send(chanal);
			break;
	}

	ipc.send('sync', message);
};
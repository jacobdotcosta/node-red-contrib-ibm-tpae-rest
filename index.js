const axios = require('axios');

function IndexNode(config) {
	RED.nodes.createNode(this, config);
	// node-specific code goes here

	this.on('input', function (msg, send, done) {
		// do something with 'msg'
		log("tpae host: ", RED.settings.tpaeHost, ":", RED.settings.tpaePort);
		this.send(msg);
		// Once finished, call 'done'.
		// This call is wrapped in a check that 'done' exists
		// so the node will work in earlier versions of Node-RED (<1.0)
		if (done) {
			done();
		}
	});
}

RED.nodes.registerType("index", IndexNode, {
	settings: {
		tpaeHost: {
			value: "localhost",
			exportable: true
		}
		, tpaePort: {
			value: "9080",
			exportable: true
		}
	}
});

module.exports = function (RED) {
	"use strict";
	const http = require('https');
	const tpaeMboPrefix = '/maxrest/rest/mbo';

	// function oneditprepare() {
	// }

	function MBO(config) {
		RED.nodes.createNode(this, config);
		this.mbo = config.mbo;
		this.operation = config.operation
		// console.debug("RED.settings: ", RED.settings);
		// console.debug("RED.nodes: ", RED.nodes);
		console.debug("config: ", config);
		console.debug("this.credentials: ", this.credentials);
		// try {
			// var username = this.credentials.username;
			var password = this.credentials.password;
			// console.debug("RED.settings: ", RED.settings);
			var node = this;
			console.debug("node: ", node);
			node.on('input', function (msg, send, done) {
				try {
					// console.debug("RED.settings: ", RED.settings);
					// console.debug("RED.nodes: ", RED.nodes);
					console.debug("config: ", config);
					console.debug("msg: ", msg);
					// try {
					// var connectionName = RED.nodes.getNode(config.server).name.replace(/ /g, '');
					// var sessionInfo = localContext.get(connectionName);
					// } catch (err) {
					// 	console.error("err: ", err);
					// 	console.error("msg: ", msg);
					// 	done(err);
					// }
					// console.debug("BajarOTsSoloCabeceras node input: ", msg);
					// console.debug("RED: ", RED.settings);

					// Retrieve the config node
					this.server = RED.nodes.getNode(config.server);
					console.debug("this.server: ", this.server);
					var username = '';
					var password = '';
					if (msg.username) {
						username = msg.username;
						password = msg.password;
					} else {
						username = this.username;
						password = this.password;
					}
					const tpaePath = `/${tpaeMboPrefix}/${config.mbo}/?_lid=${username}&_lpwd=${password}`;
					console.debug("tpaePath: ", tpaePath);
					const options = {
						// hostname: `${RED.settings.ngiMgHost}`,
						hostname: `${this.server.host}`,
						// hostname: `${ngiMgHost}`,
						// port: 9080,
						path: `${tpaePath}`,
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'Content-Length': (msg.payload && msg.payload.length) ? msg.payload.length : 0,
						},
					};
					// console.debug("options: ", options)
					const req = http.request(options, response => {
						// const req = http.post(tpaeUrl, (response) => {
						console.debug(`Repsonse Status: ${response.statusCode}: ${response.statusMessage}`);
						// console.debug("response: ", response);
						let posts = "";
						response.on("data", function (data) {
							posts += data.toString();
						});
						response.on("end", function () {
							console.debug("posts.length: ", posts.length);
							console.debug("posts: ", posts.toString());
							msg.payload = posts.toString();
							msg.httpStatusCode = response.statusCode;
							msg.httpStatusMessage = response.statusMessage;
							send(msg);
							done();
						});
					}, error => {
						console.error("error: ", error);
					});
					req.on('error', error => {
						console.error("error 2: ", error);
					});
					if (msg.payload) {
						req.write(msg.payload);
					}
					req.end();
				} catch (err) {
					console.error("err: ", err);
					console.error("msg: ", msg);
					done(err);
				}
			});
		// } catch (err) {
		// 	console.error("err: ", err);
		// 	console.error("msg: ", msg);
		// 	done(err);
		// }
	}

	RED.nodes.registerType("mbo", MBO, {
		defaults: {
			server: { value: "", type: "tpae-server" }
		},
		credentials: {
			username: { type: "text" },
			password: { type: "password" }
		}
	});
}

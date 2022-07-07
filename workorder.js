const http = require('http');
// const axios = require('axios');

module.exports = function (RED) {
	var tpaeBaseUrl = 'http://icd761.trikorasolutions.net:9080';
	var maxrestFolder = '/maxrest/rest';
	var extraParams = '_format=json';
	var userCreds = '_lid=maxadmin&_lpwd=maxadmin';

	function WorkorderNode(config) {
		// console.log("WorkorderNode: ", config);
		RED.nodes.createNode(this, config);
		var node = this;
		node.on('input', function (msg) {
			msg.payload = msg.payload.toLowerCase();
			node.send(msg);
		});
	}

	function WorkorderGetNode(config) {
		RED.nodes.createNode(this, config);
		var node = this;
		node.on('input', function (msg) {
			console.log("WorkorderGetNode node input: ", msg);
			var tpaeUrl = `${tpaeBaseUrl}${maxrestFolder}/mbo/workorder/${msg.payload}?${userCreds}&${extraParams}`;
			// console.log("tpaeUrl: ", tpaeUrl);
			http.get(tpaeUrl, function (response) {
				let posts = "";
				response.on("data", function (data) {
					posts += data.toString();
				});
				response.on("end", function () {
					// console.log("posts.length: ", posts.length);
					// console.log("posts: ", posts.toString());
					msg.payload = posts.toString();
					node.send(msg);
				});

			});
		});
	}

	function WorkorderCreateNode(config) {
		RED.nodes.createNode(this, config);
		var node = this;
		node.on('input', function (msg) {
			var urlParams = '';
			console.log("WorkorderCreateNode node input: ", msg);
			for (var attributename in msg.payload) {
				urlParams += "&" + attributename + "=" + encodeURIComponent(msg.payload[attributename]);
			}
			var tpaeUrl = `${tpaeBaseUrl}${maxrestFolder}/mbo/workorder/?${userCreds}&${extraParams}${urlParams}`;
			console.log("tpaeUrl: ", tpaeUrl);
			// http.post(tpaeUrl, function (response) {
			// 	let posts = "";
			// 	response.on("data", function (data) {
			// 		posts += data.toString();
			// 	});
			// 	response.on("end", function () {
			// 		console.log("posts.length: ", posts.length);
			// 		console.log("posts: ", posts.toString());
			// 		msg.payload = posts.toString();
			// 		node.send(msg);
			// 	});
			// });

			const options = {
				hostname: 'icd761.trikorasolutions.net',
				port: 9080,
				path: `${maxrestFolder}/mbo/workorder/?${userCreds}&${extraParams}${urlParams}`,
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
			};

			const req = http.request(options, response => {
				// const req = http.post(tpaeUrl, (response) => {
				console.log(`statusCode: ${response.statusCode}`);
				let posts = "";
				response.on("data", function (data) {
					posts += data.toString();
				});
				response.on("end", function () {
					console.log("posts.length: ", posts.length);
					console.log("posts: ", posts.toString());
					msg.payload = posts.toString();
					if (response.statusCode > 300) {
						msg.error = `{"message": "${posts.toString()}", "statusCode": ${response.statusCode}}`
					}
					node.send(msg);
				});
			}, error => {
				console.log("error: ", error);
			});
			req.on('error', error => {
				console.error("error: ", error);
			});

			req.end();
		});
	}

	function WorkorderChangeStatusNode(config) {
		RED.nodes.createNode(this, config);
		var node = this;
		node.on('input', function (msg) {
			msg.payload = msg.payload.toLowerCase();
			node.send(msg);
		});
	}

	RED.nodes.registerType("workorder", WorkorderNode);
	RED.nodes.registerType("workorderGet", WorkorderGetNode);
	RED.nodes.registerType("workorderChangeStatus", WorkorderChangeStatusNode);
	RED.nodes.registerType("workorderCreate", WorkorderCreateNode);
}

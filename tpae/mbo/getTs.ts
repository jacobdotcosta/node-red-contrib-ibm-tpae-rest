const http = require('http');
const axios = require('axios');
const request = require('request');

const mboConstants = require('./constants');

// module.exports = Object.freeze({
// module.exports.get =

module.exports = {
	get: async function (host, port, username, password, mboName, mboId) {
		const tpaePath = `/${mboConstants.TPAE_MBO_PREFIX}/${mboName}/${mboId}?_lid=${username}&_lpwd=${password}&_format=json`;
		console.debug("tpaePath: ", tpaePath);
		// const tpaeUrl = `${host}:${port}${tpaePath}`;
		const tpaeUrl = "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY";
		console.debug("tpaeUrl: ", tpaeUrl);
		const response = await axios.get(`${host}:${port}${tpaePath}`, {
			headers: {
				'Content-Type': 'application/json'
			}
		});
		console.debug("response: ", response);
		const options = {
			// hostname: `${RED.settings.ngiMgHost}`,
			// hostname: `${host}`,
			// hostname: `https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY`,
			port: `${port}`,
			path: `${tpaePath}`,
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				// 'Content-Length': (msg.payload && msg.payload.length) ? msg.payload.length : 0,
			},
			timeout: 5000
		};
		console.debug("options: ", options)
		const req = await http.request(options, response => {
			// return new Promise((resolve) => {
			// http.request(options, response => {
			// const req = http.post(tpaeUrl, (response) => {
			console.debug(`Response Status: ${response.statusCode}: ${response.statusMessage}`);
			// console.debug("response: ", response);
			let posts = "";
			response.on("data", function (data) {
				posts += data.toString();
			});
			response.on("end", function () {
				console.debug("posts.length: ", posts.length);
				console.debug("posts: ", posts.toString());
				var msg = { payload: "", httpStatusCode: 0, httpStatusMessage: "" };
				msg.payload = posts.toString();
				msg.httpStatusCode = response.statusCode;
				msg.httpStatusMessage = response.statusMessage;
				console.debug("get return: ", msg);
				return msg;
				// done();
			});
		}, error => {
			console.error("get error: ", error);
		});
		// })

		req.on('error', error => {
			console.error("error 2: ", error);
		});

		// if (msg.payload) {
		// 	req.write(msg.payload);
		// }
	}
}
// });

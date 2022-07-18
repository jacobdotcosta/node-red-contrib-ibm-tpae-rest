var mboConstants = require('./constants');

// module.exports = Object.freeze({
module.exports.get = function (host, port, username, password, mboName, mboId) {
	const tpaePath = `/${mboConstants.TPAE_MBO_PREFIX}/${mboName}/${mboId}?_lid=${username}&_lpwd=${password}&_format=json`;
	console.debug("tpaePath: ", tpaePath);
	const options = {
		// hostname: `${RED.settings.ngiMgHost}`,
		hostname: `${host}`,
		// hostname: `${ngiMgHost}`,
		port: `${port}`,
		path: `${tpaePath}`,
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': (msg.payload && msg.payload.length) ? msg.payload.length : 0,
		},
	};
	console.debug("options: ", options)
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
			return msg;
			// done();
		});
	}, error => {
		console.error("error: ", error);
	});
	req.on('error', error => {
		console.error("error 2: ", error);
	});
	// if (msg.payload) {
	// 	req.write(msg.payload);
	// }
}
;
// });

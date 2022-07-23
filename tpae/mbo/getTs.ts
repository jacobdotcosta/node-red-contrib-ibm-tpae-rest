
const http = require('http');
const axios = require('axios');
const request = require('request');

const mboConstants = require('./constants');

module.exports = {
	get: async function (host, port, username, password, mboName, mboId) {
		console.debug(`#get(${host}, )`);
		const tpaePath = `/${mboConstants.TPAE_MBO_PREFIX}/${mboName}/${mboId}?_lid=${username}&_lpwd=${password}&_format=json`;
		console.debug("tpaePath: ", tpaePath);
		const tpaeUrl = `${host}${tpaePath}`;
		// const tpaeUrl = "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY";
		console.debug("tpaeUrl: ", tpaeUrl);
		var msg = { payload: "", httpStatusCode: 0, httpStatusMessage: "" };
		try {
			const response = await axios.get(`${tpaeUrl}`, {
				headers: {
					'Content-Type': 'application/json'
				}
			});
			console.debug("response: ", response);
			console.debug("response: ", response.data);
			msg.payload = JSON.stringify(response.data);
			msg.httpStatusCode = response.status;
			msg.httpStatusMessage = response.statusText;
			// return response.data;
		} catch (error) {
			console.debug("err: ", error);
			if (axios.isAxiosError(error)) {
				console.debug("isAxiosError err: ", error)
			} else {
				console.debug("error.response: ", error.response);
			}
			if (error.response) {
				msg.payload = error.response.statusText;
				msg.httpStatusCode = error.response.status;
				msg.httpStatusMessage = error.response.statusText;
				console.log(error.response.data);
				console.log(error.response.status);
				console.log(error.response.headers);
			}
		}
		return msg;
	}
}

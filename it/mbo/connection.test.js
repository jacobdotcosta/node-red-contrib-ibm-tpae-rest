var assert = require('assert');
var helper = require("node-red-node-test-helper");
const yargs = require('yargs');
const { hideBin } = require('yargs/helpers')

var otModule = require("../../mbo.js");
var mgConfigModule = require("../../tpaeServer.js");

helper.init(require.resolve('node-red'), {
	functionGlobalContext: { os: require('os') }
});

describe('mbo Module', function () {
	const nodePrefix = "mbo-workorder";

	beforeEach(function (done) {
		helper.startServer(done);
	});

	afterEach(function (done) {
		helper.unload().then(function () {
			helper.stopServer(done);
		});
	});

	it('IT :: MBO :: workorder Anonymous not allowed', function (done) {
		console.debug("process.argv: ", process.argv);
		const argv = yargs(hideBin(process.argv)).argv;
		console.debug("argv: ", argv);
		const tpaeHost = argv.tpaeHost;
		const tpaePort = argv.tpaePort;
		const username = argv.username;
		const password = argv.password;
		try {
			var flow = [{ id: `${nodePrefix}-1`, type: "mbo", mbo: "workorder", operation: "Get", name: "IT workorder get", server: "tpaeServer", wires: [[`${nodePrefix}-2`]] },
			{ id: `${nodePrefix}-2`, type: "helper" }, { id: "tpaeServer", type: "tpae-server", host: `${tpaeHost}`, port: `${tpaePort}`, name: "TPAE Test Host" }];
			helper.load([otModule, mgConfigModule], flow, { username: `${username}`, password: `${password}` }, function () {
				// console.debug("load: ");
				var tpaeServer = helper.getNode(`tpaeServer`);
				tpaeServer.credentials = {
					username: `${username}`, password: `${password}`
				};
				var n2 = helper.getNode(`${nodePrefix}-2`);
				// console.debug("n2: ", n2);
				var n1 = helper.getNode(`${nodePrefix}-1`);
				n2.on("input", function (msg) {
					try {
						// console.debug("msg: ", msg);
						assert.equal(msg.httpStatusCode, 400);
						assert.equal(msg.httpStatusMessage, "Bad Request");
						// assert.equal(msg.payload, "Error 400: BMXAA7901E - You cannot log in at this time. Contact the system administrator.");
						// var msgError = JSON.parse(msg.error);
						done();
					} catch (err) {
						console.error("err: ", err);
						console.error("msg: ", msg);
						done(err);
					}
				});
				n1.receive({  });
			});
		} catch (err) {
			console.error("err: ", err);
			console.error("msg: ", msg);
			done();
		}
	}, 5000);

	// it('IT: BajarOTsSoloCabeceras OK', function (done) {
	// 	console.debug("process.argv: ", process.argv);
	// 	const argv = yargs(hideBin(process.argv)).argv;
	// 	console.debug("argv: ", argv);
	// 	const idAuth = argv.idAuth;
	// 	var flow = [{ id: `${nodePrefix}-1`, type: "mbo", operation: "BajarOTsSoloCabeceras", name: "bajar-ots-solo-cabeceras: IT BajarOTsSoloCabeceras", server: "tpaeServer", wires: [[`${nodePrefix}-2`]] },
	// 	{ id: `${nodePrefix}-2`, type: "helper" }, { id: "tpaeServer", type: "tpae-server", host: "www.movilgmao.es", port: 443, name: "MovilGmao Host" }];
	// 	helper.load([otModule, mgConfigModule], flow, { password: `${idAuth}` }, function () {
	// 		var n2 = helper.getNode(`${nodePrefix}-2`);
	// 		var n1 = helper.getNode(`${nodePrefix}-1`);
	// 		n2.on("input", function (msg) {
	// 			try {
	// 				// console.log("n2 msg: ", msg);
	// 				// console.log("n2 msg.payload: ", msg.payload);
	// 				var otJson = JSON.parse(msg.payload);
	// 				// console.log("workorderJson: ", otJson.ots.length);
	// 				// console.log("n2 msg.payload.WORKORDER: ", workorderJson.WORKORDER);
	// 				// console.log("n2 msg.payload.WORKORDER.Attributes: ", workorderJson.WORKORDER.Attributes);
	// 				assert.equal(msg.httpStatusCode, 200);
	// 				assert(otJson.ots);
	// 				done();
	// 			} catch (err) {
	// 				console.error("err: ", err);
	// 				console.error("msg: ", msg);
	// 				done(err);
	// 			}
	// 		});
	// 		n1.receive({ username: `${username}`, password: `${password}` });
	// 	});
	// }, 10000);
});

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
		// console.debug("process.argv: ", process.argv);
		const argv = yargs(hideBin(process.argv)).argv;
		// console.debug("argv: ", argv);
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
					console.debug("n2 input msg: ", msg);
					try {
						assert.equal(msg.httpStatusCode, 200);
						assert.equal(msg.httpStatusMessage, "OK");
						var wo1 = JSON.parse(msg.payload);
						assert.equal(wo1.WORKORDER.Attributes.WONUM.content, "1638");
						done();
					} catch (err) {
						console.error("err: ", err);
						console.error("msg: ", msg);
						done(err);
					}
				});
				n1.receive({ id: 1, username: `${username}`, password: `${password}` });
			});
		} catch (err) {
			console.error("err: ", err);
			console.error("msg: ", msg);
			done();
		}
	}).timeout(10000);

});

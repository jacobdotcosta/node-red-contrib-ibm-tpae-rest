var assert = require('assert');
var helper = require("node-red-node-test-helper");

var workorderModule = require("../mbo.js");

describe('mbo Module', function () {

	afterEach(function () {
		helper.unload();
	});

	it('mbo Module should be loaded', function (done) {
		const nodeName = "MBO module Test Name";
		var flow = [{ id: "n1", type: "mbo", mbo: "workorder", operation: "Get", name: `${nodeName}` }];
		helper.load(workorderModule, flow, { username: "jane", password: "doe" }, function () {
			try {
				var n1 = helper.getNode("n1");
				console.debug("n1: ", n1);
				assert.equal(n1.mbo, "workorder");
				assert.equal(n1.operation, "Get");
				assert.equal(n1.name, nodeName);
				done();
			} catch (err) {
				console.error("err: ", err);
				console.error("msg: ", msg);
				done(err);
			}
		});
	});

});

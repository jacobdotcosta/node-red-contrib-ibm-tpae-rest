var helper = require("node-red-node-test-helper");
var workorderModule = require("../workorder.js");

describe('workorder Module', function () {

	afterEach(function () {
		helper.unload();
	});

	it('should be loaded', function (done) {
		var flow = [{ id: "n1", type: "workorder", name: "test name" }];
		helper.load(workorderModule, flow, function () {
			var n1 = helper.getNode("n1");
			expect(n1.name).toBe('test name');
			done();
		});
	});

	it('should be loaded', function (done) {
		var flow = [{ id: "n1", type: "workorderGet", name: "WO get name" }];
		helper.load(workorderModule, flow, function () {
			var n1 = helper.getNode("n1");
			expect(n1.name).toBe('WO get name');
			done();
		});
	});

	it('should be loaded', function (done) {
		var flow = [{ id: "n1", type: "workorderChangeStatus", name: "workorder change status name" }];
		helper.load(workorderModule, flow, function () {
			var n1 = helper.getNode("n1");
			// console.log("n1: ", n1);
			expect(n1.name).toBe('workorder change status name');
			done();
		});
	});

	test('should be loaded', function (done) {
		var flow = [{ id: "n1", type: "workorderCreate", name: "workorder create name" }];
		helper.load(workorderModule, flow, function () {
			var n1 = helper.getNode("n1");
			// console.log("n1: ", n1);
			expect(n1.name).toBe('workorder create name');
			done();
		});
	});

	it('workorderNode: should make payload lower case', function (done) {
		var flow = [{ id: "n1", type: "workorder", name: "test name", wires: [["n2"]] },
		{ id: "n2", type: "helper" }];
		helper.load(workorderModule, flow, function () {
			var n2 = helper.getNode("n2");
			var n1 = helper.getNode("n1");
			n2.on("input", function (msg) {
				msg.should.have.property('payload', 'uppercase');
				done();
			});
			n1.receive({ payload: "UpperCase" });
		});
	});

});

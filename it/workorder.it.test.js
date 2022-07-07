var helper = require("node-red-node-test-helper");
var workorderModule = require("../workorder.js");

describe('workorder Module', function () {

	afterEach(function () {
		helper.unload();
	});

	test('workorderGetNode: IT get Workorder', function (done) {
		var flow = [{ id: "n1", type: "workorderGet", name: "workorderGetNode: IT get Workorder", wires: [["n2"]] },
		{ id: "n2", type: "helper" }];
		helper.load(workorderModule, flow, function () {
			var n2 = helper.getNode("n2");
			var n1 = helper.getNode("n1");
			n2.on("input", function (msg) {
				try {
					// console.log("n2 msg: ", msg);
					// console.log("n2 msg.payload: ", msg.payload);
					var workorderJson = JSON.parse(msg.payload);
					// console.log("workorderJson: ", workorderJson);
					// console.log("n2 msg.payload.WORKORDER: ", workorderJson.WORKORDER);
					// console.log("n2 msg.payload.WORKORDER.Attributes: ", workorderJson.WORKORDER.Attributes);
					expect(workorderJson.WORKORDER.Attributes.WONUM.content).toBe("T1060");
					done();
				} catch (err) {
					done(err);
				}
			});
			n1.receive({ payload: "133347" });
		});
	}, 10000);

	test('workorderCreateNode: IT create Workorder', function (done) {
		var flow = [{ id: "n1", type: "workorderCreate", name: "workorderCreate: IT create Workorder", wires: [["n2"]] },
		{ id: "n2", type: "helper" }];
		helper.load(workorderModule, flow, function () {
			var n2 = helper.getNode("n2");
			var n1 = helper.getNode("n1");
			var woJson = JSON.parse('{"DESCRIPTION": "NodeJS IT test WO", "SITEID": "PMSCRTP"}');
			n2.on("input", function (msg) {
				try {
					console.log("workorderCreateNode msg: ", msg);
					// console.log("n2 msg.payload: ", msg.payload);
					var workorderJson = JSON.parse(msg.payload);
					// console.log("workorderJson: ", workorderJson);
					// console.log("n2 msg.payload.WORKORDER: ", workorderJson.WORKORDER);
					// console.log("n2 msg.payload.WORKORDER.Attributes: ", workorderJson.WORKORDER.Attributes);
					expect(workorderJson.WORKORDER.Attributes.DESCRIPTION.content).toBe("NodeJS IT test WO");
					done();
				} catch (err) {
					done(err);
				}
			});
			try {
				n1.receive({ payload: woJson });
			} catch (err) {
				done(err);
			}
		});
	}, 10000);

});

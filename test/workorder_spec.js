var helper = require("node-red-node-test-helper");
var workorderNode = require("../workorder.js");

describe('workorder Node', function () {

  afterEach(function () {
    helper.unload();
  });

  it('should be loaded', function (done) {
    var flow = [{ id: "n1", type: "workorder", name: "test name" }];
    helper.load(workorderNode, flow, function () {
      var n1 = helper.getNode("n1");
      n1.should.have.property('name', 'test name');
      done();
    });
  });

  it('should make payload lower case', function (done) {
    var flow = [{ id: "n1", type: "workorder", name: "test name",wires:[["n2"]] },
    { id: "n2", type: "helper" }];
    helper.load(workorderNode, flow, function () {
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

module.exports = function (RED) {
	function TpaeServerNode(config) {
		RED.nodes.createNode(this, config);
		console.log("TpaeServerNode config: ", config);
		console.log("TpaeServerNode credentials: ", this.credentials);
		this.host = config.host;
		this.port = config.port;
		this.name = config.name;
		this.username = this.credentials.username;
		this.password = this.credentials.password;
	}
	RED.nodes.registerType("tpae-server", TpaeServerNode, {
		credentials: {
			username: { type: "text" },
			password: { type: "password" }
		}
	});
}

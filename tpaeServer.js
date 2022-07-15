module.exports = function (RED) {
	function MgRemoteServerNode(config) {
		RED.nodes.createNode(this, config);
		console.log("Config: ", config);
		console.log("this.credentials: ", this.credentials);
		this.host = config.host;
		this.port = config.port;
		this.name = config.name;
		this.password = this.credentials.password;
	}
	RED.nodes.registerType("mg-remote-server", MgRemoteServerNode, {
		credentials: {
			password: { type: "password" }
		}
	});
}

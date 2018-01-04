var Whitelist = artifacts.require("Whitelist");
var BloqToken = artifacts.require("BloqToken");

module.exports = function(deployer, network, accounts) {
	deployer.deploy(Whitelist, [accounts[0], accounts[1], accounts[2]], [1, 1, 1]).then(function() {
	  return deployer.deploy(BloqToken, [accounts[0], accounts[1], accounts[2]], [100, 75, 25], Whitelist.address, [0, 100]);
	});
};

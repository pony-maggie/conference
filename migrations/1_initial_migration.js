//var Migrations = artifacts.require("./Migrations.sol");
var Conference = artifacts.require("./Conference.sol");

module.exports = function(deployer) {
  //deployer.deploy(Migrations);
  deployer.deploy(Conference);
};

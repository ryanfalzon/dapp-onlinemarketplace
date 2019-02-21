const Marketplace = artifacts.require("Marketplace.sol");
const StoreManager = artifacts.require("StoreManager.sol");

module.exports = function(deployer) {
  deployer.deploy(Marketplace).then(function(){
    return deployer.deploy(StoreManager, Marketplace.address);
  });
};

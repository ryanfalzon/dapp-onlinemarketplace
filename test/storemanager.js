// Import smart contract
var StoreManager = artifacts.require("./StoreManager.sol");

contract('StoreManager', function(accounts) {
    var administratorAddress = accounts[0];
    var firstManagerAddress = accounts[1];
    var secondManagerAddress = accounts[2]
    var externalAddress = accounts[3];

    it('Should revert the transaction of AddStore when an invalid address calls it', () => {
        return StoreManager.deployed().then(instance => {
            return instance.AddStore('Name', 'Description', 'Image URL', {from: externalAddress});
        })
        .then(() => {
            assert.fail();
        })
        .catch(error => {
            assert.notEqual(error.message, 'assert.fail()', 'Transaction was not reverted with an invalid address');
        });
    });

    it('Should revert the transaction of RemoveStore when an invalid address calls it', () => {
        return StoreManager.deployed().then(instance => {
            return instance.RemoveStore(101, {from: externalAddress});
        })
        .then(() => {
            assert.fail();
        })
        .catch(error => {
            assert.notEqual(error.message, 'assert.fail()', 'Transaction was not reverted with an invalid address');
        });
    });

    it('Should revert the transaction of GetAllStoresByOwner when an invalid address calls it', () => {
        return StoreManager.deployed().then(instance => {
            return GetAllStoresByOwner(firstManagerAddress, {from: externalAddress});
        })
        .then(() => {
            assert.fail();
        })
        .catch(error => {
            assert.notEqual(error.message, 'assert.fail()', 'Transaction was not reverted with an invalid address');
        });
    });
});
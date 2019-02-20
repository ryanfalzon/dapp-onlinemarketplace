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

    it('Should revert the transaction of DeleteStore when an invalid address calls it', () => {
        return StoreManager.deployed().then(instance => {
            return instance.DeleteStore(101, {from: externalAddress});
        })
        .then(() => {
            assert.fail();
        })
        .catch(error => {
            assert.notEqual(error.message, 'assert.fail()', 'Transaction was not reverted with an invalid address');
        });
    });
	
	it('Should revert the transaction of DeleteStore when an address tries to remove a store which is not theirs', () => {
		return StoreManager.deployed().then(instance => {
			return instance.AddStore('Name', 'Description', 'Image URL', {from: firstManagerAddress}).then(() => {
				return instance.DeleteStore(101, {from: secondManagerAddress});
			})
			.then(() => {
				assert.fail();
			})
			.catch(error => {
				assert.notEqual(error.message, 'assert.fail()', 'Transaction was not reverted with an invalid address');
			});
		});
	}
	
	it('Should revert the transaction of DeleteStore when trying to remove a store that does not exist', () => {
        return StoreManager.deployed().then(instance => {
            return instance.DeleteStore(101, {from: firstManagerAddress});
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
            return instance.GetAllStoresByOwner(firstManagerAddress, {from: externalAddress});
        })
        .then(() => {
            assert.fail();
        })
        .catch(error => {
            assert.notEqual(error.message, 'assert.fail()', 'Transaction was not reverted with an invalid address');
        });
    });
	
	it('Should revert the transaction of CreateProduct when an invalid address calls it', () => {
        return StoreManager.deployed().then(instance => {
			return instance.CreateProduct(101, 'Name', 'Description', 'Image URL', 10, 100, {from: externalAddress});
		})
		.then(() => {
            assert.fail();
        })
        .catch(error => {
            assert.notEqual(error.message, 'assert.fail()', 'Transaction was not reverted with an invalid address');
        });
    });
	
	it('Should revert the transaction of CreateProduct when address who is not the store owner calls it', () => {
        return StoreManager.deployed().then(instance => {
			return instance.CreateProduct(101, 'Name', 'Description', 'Image URL', 10, 100, {from: firstManagerAddress});
		})
		.then(() => {
            assert.fail();
        })
        .catch(error => {
            assert.notEqual(error.message, 'assert.fail()', 'Transaction was not reverted with an invalid address');
        });
    });
	
	it('Should revert the transaction of CreateProduct if the price sent is less than or equal to 0', () => {
        return StoreManager.deployed().then(instance => {
			return instance.reateProduct(1010, 'Name', 'Description', 'Image URL', -1, 100, {from: firstManagerAddress});
		})
		.then(() => {
            assert.fail();
        })
        .catch(error => {
            assert.notEqual(error.message, 'assert.fail()', 'Transaction was not reverted with an invalid address');
        });
    });
	
	it('Should revert the transaction of CreateProduct if the price sent is greater than the maximum number that can be stores in uint', () => {
        return StoreManager.deployed().then(instance => {
			return instance.CreateProduct(1010, 'Name', 'Description', 'Image URL', ((2**256-1) + 1), 100, {from: firstManagerAddress});
		})
		.then(() => {
            assert.fail();
        })
        .catch(error => {
            assert.notEqual(error.message, 'assert.fail()', 'Transaction was not reverted with an invalid address');
        });
    });
	
	it('Should revert the transaction of CreateProduct if the available amounts sent is less than or equal to 0', () => {
        return StoreManager.deployed().then(instance => {
			return instance.CreateProduct(1010, 'Name', 'Description', 'Image URL', 10, -1, {from: firstManagerAddress});
		})
		.then(() => {
            assert.fail();
        })
        .catch(error => {
            assert.notEqual(error.message, 'assert.fail()', 'Transaction was not reverted with an invalid address');
        });
    });
	
	it('Should revert the transaction of DeleteProduct when an invalid address calls it', () => {
        rturn StoreManager.deployed().then(instance => {
			
		}
		.then(() => {
            assert.fail();
        })
        .catch(error => {
            assert.notEqual(error.message, 'assert.fail()', 'Transaction was not reverted with an invalid address');
        });
    });
	
	it('Should revert the transaction of DeleteProduct when address who is not the store owner calls it', () => {
        
    });
	
	it('Should revert the transaction of DeleteProduct when trying to remove a store that does not exist', () => {
		
	}
	
	it('Should revert the transaction of BuyProduct when the value sent is smaller than the actual total price', () => {
		return StoreManager.deployed().then(instance => {
		}
		.then(() => {
			assert.fail();
		}
		.catch
	}
	
	it('Should revert the transaction of BuyProduct when the buyers balance is smaller than the actual total price', () => {

	}

	it('Should revert the transaction of BuyProduct when the total quantity needed is smaller than the total quantity available', () => {
		
	}
	
	it('Should revert the transaction of WithdrawStore when an invalid address calls it', () => {
        
    });
	
	it('Should revert the transaction of WithdrawStore when an address who is not the store owner calls it', () => {
        
    });
	
	it('Should revert the transaction of WithdrawBalance when the balance of a store is 0', () => {
		
	}
});
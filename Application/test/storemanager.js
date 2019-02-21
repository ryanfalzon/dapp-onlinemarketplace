var StoreManager = artifacts.require("./StoreManager.sol");
var Marketplace = artifacts.require("./Marketplace.sol");

contract('StoreManager', function(accounts) {
    var administratorAddress = accounts[0];
    var firstManagerAddress;
    var secondManagerAddress;
    var externalAddress = accounts[3];

    before(async function() {
        var instance = await Marketplace.deployed();
        firstManagerAddress = await instance.AddManager(accounts[1], {from: administratorAddress}).then(response => {
            return response.logs[0].args[0];
        });
        secondManagerAddress = await instance.AddManager(accounts[2], {from: administratorAddress}).then(response => {
            return response.logs[0].args[0];
        });
    });

    it('Should accept the transaction of a valid CreateStore request', () => {
        return StoreManager.deployed().then(instance => {
            return instance.CreateStore('Seat', 'Description', 'Image URL', {from: firstManagerAddress});
        })
        .then(error => {
            assert.fail();
        })
        .catch(error => {
            assert.equal(error.message, 'assert.fail()', 'Transactions was not accpeted');
        });
    });

    it('Should revert the transaction of CreateStore when an invalid address calls it', () => {
        return StoreManager.deployed().then(instance => {
            return instance.CreateStore('Audi', 'Description', 'Image URL', {from: externalAddress});
        })
        .then(() => {
            assert.fail();
        })
        .catch(error => {
            assert.notEqual(error.message, 'assert.fail()', 'Transaction was not reverted with an invalid address');
        });
    });

    it('Should accept the transaction of a valid DeleteStore request', () => {
		return StoreManager.deployed().then(instance => {
            return instance.CreateStore('Honda', 'Description', 'Image URL', {from: firstManagerAddress}).then(response => {
                return instance.DeleteStore(response.logs[0].args[0], {from: firstManagerAddress}); 
            })
            .then(() => {
                assert.fail();
            })
            .catch(error => {
                assert.equal(error.message, 'assert.fail()', 'Transaction was not reverted with an invalid address');
            });
        });
	});

    it('Should revert the transaction of DeleteStore when an invalid address calls it', () => {
        return StoreManager.deployed().then(instance => {
            return instance.CreateStore('VW', 'Description', 'Image URL', {from: firstManagerAddress}).then(response => {
                return instance.DeleteStore(response.logs[0].args[0], {from: externalAddress}); 
            })
            .then(() => {
                assert.fail();
            })
            .catch(error => {
                assert.notEqual(error.message, 'assert.fail()', 'Transaction was not reverted with an invalid address');
            });
        });
    });
	
	it('Should revert the transaction of DeleteStore when an address tries to remove a store which is not theirs', () => {
		return StoreManager.deployed().then(instance => {
            return instance.CreateStore('Hyundai', 'Description', 'Image URL', {from: firstManagerAddress}).then(response => {
                return instance.DeleteStore(response.logs[0].args[0], {from: secondManagerAddress}); 
            })
            .then(() => {
                assert.fail();
            })
            .catch(error => {
                assert.notEqual(error.message, 'assert.fail()', 'Transactions was not accpeted');
            });
        });
    });
	
	it('Should revert the transaction of DeleteStore when trying to remove a store that does not exist', () => {
        return StoreManager.deployed().then(instance => {
            return instance.CreateStore('Honda', 'Description', 'Image URL', {from: firstManagerAddress}).then(response => {
                return instance.DeleteStore(response.logs[0].args[0], {from: firstManagerAddress}).then(() => {
                    return instance.DeleteStore(response.logs[0].args[0], {from: firstManagerAddress});
                })
                .then(() => {
                    assert.fail();
                })
                .catch(error => {
                    assert.notEqual(error.message, 'assert.fail()', 'Transaction was not reverted with an invalid address');
                });
            });
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

    it('Should accept the transaction of a valid CreateProduct request', () => {
        return StoreManager.deployed().then(instance => {
            return instance.CreateStore('Range Rover', 'Description', 'Image URL', {from: firstManagerAddress}).then(response => {
                return instance.CreateProduct(response.logs[0].args[0], 'Evoque', 'Description', 'Image URL', 10, 100, {from: firstManagerAddress});
            })
            .then(() => {
                assert.fail();
            })
            .catch(error => {
                assert.equal(error.message, 'assert.fail()', 'Transactions was not accpeted');
            });
        });
    });
	
	it('Should revert the transaction of CreateProduct when an invalid address calls it', () => {
        return StoreManager.deployed().then(instance => {
            return instance.CreateStore('Range Rover', 'Description', 'Image URL', {from: firstManagerAddress}).then(response => {
                return instance.CreateProduct(response.logs[0].args[0], 'Evoque', 'Description', 'Image URL', 10, 100, {from: externalAddress});
            })
            .then(() => {
                assert.fail();
            })
            .catch(error => {
                assert.notEqual(error.message, 'assert.fail()', 'Transaction was not reverted with an invalid address');
            });
        });
    });
	
	it('Should revert the transaction of CreateProduct when address who is not the store owner calls it', () => {
        return StoreManager.deployed().then(instance => {
            return instance.CreateStore('Range Rover', 'Description', 'Image URL', {from: firstManagerAddress}).then(response => {
                return instance.CreateProduct(response.logs[0].args[0], 'Evoque', 'Description', 'Image URL', 10, 100, {from: secondManagerAddress});
            })
            .then(() => {
                assert.fail();
            })
            .catch(error => {
                assert.notEqual(error.message, 'assert.fail()', 'Transaction was not reverted with an invalid address');
            });
        });
    });
    
    it('Should accept the transaction of a valid DeleteProduct request', () => {
        return StoreManager.deployed().then(instance => {
            return instance.CreateStore('VW', 'Description', 'Image URL', {from: firstManagerAddress}).then(firstResponse => {
                return instance.CreateProduct(firstResponse.logs[0].args[0], 'Evoque', 'Description', 'Image URL', 10, 100, {from: firstManagerAddress}).then(secondResponse => {
                    return instance.DeleteProduct(secondResponse.logs[0].args[0], firstResponse.logs[0].args[0], {from: firstManagerAddress}); 
                })
                .then(() => {
                    assert.fail();
                })
                .catch(error => {
                    assert.equal(error.message, 'assert.fail()', 'Transactions was not accpeted');
                }); 
            });
        });
    });

	it('Should revert the transaction of DeleteProduct when an invalid address calls it', () => {
        return StoreManager.deployed().then(instance => {
            return instance.CreateStore('VW', 'Description', 'Image URL', {from: firstManagerAddress}).then(firstResponse => {
                return instance.CreateProduct(firstResponse.logs[0].args[0], 'Evoque', 'Description', 'Image URL', 10, 100, {from: firstManagerAddress}).then(secondResponse => {
                    return instance.DeleteStore(secondResponse.logs[0].args[0], firstResponse.logs[0].args[0], {from: externalAddress}); 
                })
                .then(() => {
                    assert.fail();
                })
                .catch(error => {
                    assert.notEqual(error.message, 'assert.fail()', 'Transaction was not reverted with an invalid address');
                }); 
            });
        });
    });
	
	it('Should revert the transaction of DeleteProduct when address who is not the store owner calls it', () => {
        return StoreManager.deployed().then(instance => {
            return instance.CreateStore('VW', 'Description', 'Image URL', {from: firstManagerAddress}).then(firstResponse => {
                return instance.CreateProduct(firstResponse.logs[0].args[0], 'Evoque', 'Description', 'Image URL', 10, 100, {from: firstManagerAddress}).then(secondResponse => {
                    return instance.DeleteStore(secondResponse.logs[0].args[0], {from: secondManagerAddress}); 
                })
                .then(() => {
                    assert.fail();
                })
                .catch(error => {
                    assert.notEqual(error.message, 'assert.fail()', 'Transaction was not reverted with an invalid address');
                }); 
            });
        }); 
    });
	
	it('Should revert the transaction of DeleteProduct when trying to remove a store that does not exist', () => {
		return StoreManager.deployed().then(instance => {
            return instance.CreateStore('VW', 'Description', 'Image URL', {from: firstManagerAddress}).then(firstResponse => {
                return instance.CreateProduct(firstResponse.logs[0].args[0], 'Evoque', 'Description', 'Image URL', 10, 100, {from: firstManagerAddress}).then(secondResponse => {
                    return instance.DeleteStore(secondResponse.logs[0].args[0], {from: secondManagerAddress}).then(() => {
                        return instance.DeleteStore(secondResponse.logs[0].args[0], {from: secondManagerAddress});
                    })
                    .then(() => {
                        assert.fail();
                    })
                    .catch(error => {
                        assert.notEqual(error.message, 'assert.fail()', 'Transaction was not reverted with an invalid address');
                    }); 
                });
            });
        }); 
    });
    
    it('Should accept the transaction of a valid BuyProduct request', () => {
		return StoreManager.deployed().then(instance => {
            return instance.CreateStore('Range Rover', 'Description', 'Image URL', {from: firstManagerAddress}).then(firstResponse => {
                return instance.CreateProduct(firstResponse.logs[0].args[0], 'Evoque', 'Description', 'Image URL', 10, 100, {from: firstManagerAddress}).then(secondResponse => {
                    return instance.BuyProduct(secondResponse.logs[0].args[0], secondResponse.logs[0].args[1], 1, 10, 99, {from: externalAddress, value: 10});
                })
                .then(() => {
                    assert.fail();
                })
                .catch(error => {
                    assert.equal(error.message, 'assert.fail()', 'Transactions was not accpeted');
                });
            });
        });
	});
	
	it('Should revert the transaction of BuyProduct when the value sent is smaller than the actual total price', () => {
		return StoreManager.deployed().then(instance => {
            return instance.CreateStore('Range Rover', 'Description', 'Image URL', {from: firstManagerAddress}).then(firstResponse => {
                return instance.CreateProduct(firstResponse.logs[0].args[0], 'Evoque', 'Description', 'Image URL', 10, 100, {from: firstManagerAddress}).then(secondResponse => {
                    return instance.BuyProduct(secondResponse.logs[0].args[0], secondResponse.logs[0].args[1], 1, 11, 99, {from: externalAddress, value: web3.utils.toWei(10)});
                })
                .then(() => {
                    assert.fail();
                })
                .catch(error => {
                    assert.notEqual(error.message, 'assert.fail()', 'Transaction was not reverted with an invalid address');
                });
            });
        });
	});
	
	it('Should revert the transaction of BuyProduct when the buyers balance is smaller than the actual total price', () => {
        return StoreManager.deployed().then(instance => {
            return instance.CreateStore('Range Rover', 'Description', 'Image URL', {from: firstManagerAddress}).then(firstResponse => {
                return instance.CreateProduct(firstResponse.logs[0].args[0], 'Evoque', 'Description', 'Image URL', 10, 100, {from: firstManagerAddress}).then(secondResponse => {
                    return instance.BuyProduct(secondResponse.logs[0].args[0], secondResponse.logs[0].args[1], 1, 10, 99, {from: externalAddress, value: web3.utils.toWei(101)}).then(r => {
                        console.log(r);
                    });
                })
                .then(() => {
                    assert.fail();
                })
                .catch(error => {
                    assert.notEqual(error.message, 'assert.fail()', 'Transaction was not reverted with an invalid address');
                });
            });
        });
	});

	it('Should revert the transaction of BuyProduct when the total quantity needed is smaller than the total quantity available', () => {
		return StoreManager.deployed().then(instance => {
            return instance.CreateStore('Range Rover', 'Description', 'Image URL', {from: firstManagerAddress}).then(firstResponse => {
                return instance.CreateProduct(firstResponse.logs[0].args[0], 'Evoque', 'Description', 'Image URL', 10, 100, {from: firstManagerAddress}).then(secondResponse => {
                    return instance.BuyProduct(secondResponse.logs[0].args[0], secondResponse.logs[0].args[1], 101, 10, -1, {from: externalAddress, value: 10});
                })
                .then(() => {
                    assert.fail();
                })
                .catch(error => {
                    assert.notEqual(error.message, 'assert.fail()', 'Transaction was not reverted with an invalid address');
                });
            });
        });
    });
    
    it('Should accept the transaction of a valid WithdrawStoreBalance request', () => {
        return StoreManager.deployed().then(instance => {
            return instance.CreateStore('Range Rover', 'Description', 'Image URL', {from: firstManagerAddress}).then(firstResponse => {
                return instance.CreateProduct(firstResponse.logs[0].args[0], 'Evoque', 'Description', 'Image URL', 10, 100, {from: firstManagerAddress}).then(secondResponse => {
                    return instance.BuyProduct(secondResponse.logs[0].args[0], secondResponse.logs[0].args[1], 1, 10, 99, {from: externalAddress, value: 10}).then(() => {
                        return instance.WithdrawStoreBalance(secondResponse.logs[0].args[1], {from: firstManagerAddress});
                    })
                    .then(() => {
                        assert.fail();
                    })
                    .catch(error => {
                        assert.equal(error.message, 'assert.fail()', 'Transactions was not accpeted');
                    });
                });
            });
        });
    });
	
	it('Should revert the transaction of WithdrawStore when an invalid address calls it', () => {
        return StoreManager.deployed().then(instance => {
            return instance.CreateStore('Range Rover', 'Description', 'Image URL', {from: firstManagerAddress}).then(firstResponse => {
                return instance.CreateProduct(firstResponse.logs[0].args[0], 'Evoque', 'Description', 'Image URL', 10, 100, {from: firstManagerAddress}).then(secondResponse => {
                    return instance.BuyProduct(secondResponse.logs[0].args[0], secondResponse.logs[0].args[1], 1, 10, 99, {from: externalAddress, value: 10}).then(() => {
                        return instance.WithdrawStoreBalance(secondResponse.logs[0].args[1], {from: externalAddress});
                    })
                    .then(() => {
                        assert.fail();
                    })
                    .catch(error => {
                        assert.notEqual(error.message, 'assert.fail()', 'Transactions was not accpeted');
                    });
                });
            });
        });
    });
	
	it('Should revert the transaction of WithdrawStore when an address who is not the store owner calls it', () => {
        return StoreManager.deployed().then(instance => {
            return instance.CreateStore('Range Rover', 'Description', 'Image URL', {from: firstManagerAddress}).then(firstResponse => {
                return instance.CreateProduct(firstResponse.logs[0].args[0], 'Evoque', 'Description', 'Image URL', 10, 100, {from: firstManagerAddress}).then(secondResponse => {
                    return instance.BuyProduct(secondResponse.logs[0].args[0], secondResponse.logs[0].args[1], 1, 10, 99, {from: externalAddress, value: 10}).then(() => {
                        return instance.WithdrawStoreBalance(secondResponse.logs[0].args[1], {from: secondManagerAddress});
                    })
                    .then(() => {
                        assert.fail();
                    })
                    .catch(error => {
                        assert.notEqual(error.message, 'assert.fail()', 'Transactions was not accpeted');
                    });
                });
            });
        }); 
    });
	
	it('Should revert the transaction of WithdrawBalance when the balance of a store is 0', () => {
		return StoreManager.deployed().then(instance => {
            return instance.CreateStore('Range Rover', 'Description', 'Image URL', {from: firstManagerAddress}).then(firstResponse => {
                return instance.CreateProduct(firstResponse.logs[0].args[0], 'Evoque', 'Description', 'Image URL', 10, 100, {from: firstManagerAddress}).then(secondResponse => {
                    return instance.WithdrawStoreBalance(secondResponse.logs[0].args[1], {from: secondManagerAddress});
                })
                .then(() => {
                    assert.fail();
                })
                .catch(error => {
                    assert.notEqual(error.message, 'assert.fail()', 'Transactions was not accpeted');
                });
            });
        });
	});
});
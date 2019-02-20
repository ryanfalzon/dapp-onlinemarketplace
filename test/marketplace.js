// // Import smart contract
// var Marketplace = artifacts.require("./Marketplace.sol");

// contract('Marketplace', function(accounts) {
//     var administratorAddress = accounts[0];
//     var firstManagerAddress = accounts[1];
//     var secondManagerAddress = accounts[2]
//     var externalAddress = accounts[3];

//     it('Should revert the transaction of AddManager when an invalid address calls it', () => {
//         return Marketplace.deployed().then(instance => {
//             return instance.AddManager(firstManagerAddress, {from: externalAddress});
//         })
//         .then(() => {
//             assert.fail();
//         })
//         .catch(error => {
//             assert.notEqual(error.message, "assert.fail()", "Transaction was not reverted with an invalid address");
//         });
//     });

//     it('Should revert the transaction of RemoveManager when an invalid address calls it', () => {
//         return Marketplace.deployed().then(instance => {
//             return instance.RemoveManager(firstManagerAddress, {from: externalAddress});
//         })
//         .then(() => {
//             assert.fail();
//         })
//         .catch(error => {
//             assert.notEqual(error.message, "assert.fail()", "Transaction was not reverted with an invalid address");
//         });
//     });

//     it('Should revert the transaction of AddManager when an address that is already a manager is passed', () => {
//         return Marketplace.deployed().then(instance => {
//             return instance.AddManager(firstManagerAddress, {from: administratorAddress}).then(() => {
//                 return instance.AddManager(firstManagerAddress, {from: administratorAddress});
//             })
//             .then(() => {
//                 assert.fail();
//             })
//             .catch(error => {
//                 assert.notEqual(error.message, "assert.fail()", "Transaction was not reverted with an address that is a store manager");
//             });
//         });
//     });

//     it('Should revert the transaction of RemoveManager when an invalid address calls it', () => {
//         return Marketplace.deployed().then(instance => {
//             return instance.RemoveManager(secondManagerAddress, {from: administratorAddress});
//         })
//         .then(() => {
//             assert.fail();
//         })
//         .catch(error => {
//             assert.notEqual(error.message, "assert.fail()", "Transaction was not reverted with an address which is not a store manager")
//         });
//     });

//     it('Should return false when an address that is not a manager is passed to the check', () => {
//         return Marketplace.deployed().then(instance => {
//             return instance.CheckManager(externalAddress, {from: administratorAddress});
//         })
//         .then(response => {
//             assert.notEqual(response, 'false');
//         });
//     });

//     it('Should return true when an address that is a manager is passed to the check', () => {
//         return Marketplace.deployed().then(instance => {
//             return instance.CheckManager(firstManagerAddress, {from: administratorAddress});
//         })
//         .then(response => {
//             assert.notEqual(response, 'true');
//         });
//     });
// });
# Avoiding Common Attacks

## Overflows & Underflows

### Definition
The Ethereum Virtual Machine uses fixed-size integer data types. For instance, `uint8` can store values from 0 to 255. The value 255 is derived from the following calcuation@ `2<sup>256</sup> - 1`. If a value greater than 255 is stored in a `uint8`, then the value that is actually found in that variable is that of 0. Similarly, if a value less than 0 is transfered to a `uint8`, then the value in the variable is that off 255. This can be very dangerous in the case that an address tries to spend more ethers than he has in his balance.

### Prevention

To prevent against overflows and underflows, a number of checks are being performed. Consider the code snippet below of the function to buy a product. In this instance, I am making the following checks relating to the prevention of overflows and underflows:
1. Check if the balance the address has, is greater than or equal to the total price;
2. Check if the number of available units is greater than or equal to the total quantity needed;

    // Function to transfer ether from buyer to store owner
    function BuyProduct(bytes32 id, bytes32 storeId, uint quantity) payable public {

        // Perform checks
        Product memory product = productsMappedToId[id];
        uint totalAmount = product.pricePerUnit * quantity;
        require(msg.value >= totalAmount, "Insufficient Funds Sent");
        require(msg.sender.balance >= msg.value, "Insufficient Funds In Account");
        require(product.availableUnits >= quantity, "Quantity Needed Is Larger Than Available");
        
        // Give change to message sender
        if(msg.value > totalAmount){
            uint change = msg.value - totalAmount;
            require(msg.sender.send(change));
        }

        // Process transactions
        productsMappedToId[id].availableUnits = product.availableUnits - quantity;
        storesMappedToId[storeId].balance += totalAmount;
        emit ProductSold(id, storeId, quantity, totalAmount);
    }


## Delegatecall

### Definition

Delegate calls are beneficial since they enable the developers to implement libraries and modular code. However, this brings with it some drawbacks, mainly because such functionality allows **anyone** to do **whatever they want** with their state. This was the root problem of the *Parity Hack*, were a mixture of misused visibility modifiers and delegate calls enabled a malicious user to take control and ownership of a contract which had a substantial amount of ether.

### Prevention

For the scope of this assignment, no delegaste calls were used. Despite the fact that almost all function have a `public` access modifier to them, custom modifiers were added to all functions to limit the access of functions to different tiers of users. The custom modifiers used were the following:

```bash
// Function to check if message sender is a manager
modifier RequireManagerStatus(){
    require(marketplace.CheckManager(msg.sender) == true);
    _;
}

// Function to check if message sender is the store owner
modifier RequireStoreOwnerStatus(bytes32 storeId){
    require(storesMappedToId[storeId].owner == msg.sender);
    _;
}

modifier RequireContractOwnerStatus(){
    require(msg.sender == administrator);
    _;
}
```

Moreover, for those functions that do not effect teh state of the smart contract and are soleoly there to read data, the keyword `view` was added to them.

## Reentrancy

### Definition

The ability to make use of another smart contract's code, can be considered as both an advantage and also a liability in smart contract programming. The calls that are made between contracts can be hijacked by hackers, and force the contracts to execute further malicious code. Consider a smart contract function which needs to transfer value to another contract. The call to the other function can be interrupted by a hacker and forces the receiving contract to execute certain code other than that already written, such as a call back to the original caller function. This means that the caller function would continue sending ether to the other smart contract until the balance reaches 0.

### Prevention
Between the two smart contracts that were developed, only one call is made, one from the `StoreManager` to the `Marketplace` contracts to check if the current address is a store manager. However, the function being called is set to *view* and thus does not change the state of the contract and no ether value is passed. This means, that the smart contracts are secure form this threat.

Neverthless, if one wants to defend form such a threat, the following conventions should be used:
- Whenever possible, use the **transfer()** function when transfering ether between contracts. This is because, this function sets a pre-defined gas limit of *2300 gas*, which would not be enough to call another contract, thus avoiding reentrancy'
- Another common practice that should be adopted in smart contracts is to put all logic, that effect the state of the smart contract, before the ether transfer call is made. This design pattern is known as **Checks-Effects-Interactions**.

## Unexpected Ether

### Definition

Whenever value is sent to the smart contract, it must be processed by either evaluating the fallback function, or another function in the contract marked as payable. However, there is one exception to this, calling the `selfdestruct()` function. This function does two things:

1. Renders the contract useless sinc eit removes all the bytecode at that address;
2. Sends all teh contract's currency, to a target address.

Since the money is sent to a contract address, the fallback function **does not** get executed and thus it would have unexpected ether.

### Prevention

Such an attacks is mostly exploited by having a **conditional statement** that is soleoly based on having the contract's **balance** below a certain amount since this would be **easily bypassed**. Therefore, having said this, the most effective solution to such an attack is not having a condition based on the balance. In the case where an exact amount of ether is required, a variable tracking the deposited ether should be created.

## Call To The Unknown

### Definition

This security vulnerability comes from the fallback function of a contract, that in certain conditions could be dangerous. The fallback function is called anytime a caller of a smart contract invokes certain functionor transfers ether to another smart contract.

### Prevention

In thie case of this assignment, the fallback function is used to revert any invalid calls that are made to the smart contract. Since no code is placed in the fallback function, the smart contract is safe from such an attack.

```bash
// Fallback function
function() external {
    revert("Please use the correct function name");
}
```

## Short Address Attack

### Definition
This attack is performed on third party applications that interact with the smart contracts. When passing parameters to the smart contract, these are encoded using the ABI specification of that contract. Third party applications can manipulate the encoded parameters to be shorter in length (*Normally 40 hex characters*) and thus, the EVM will be forced to place 0's at the end of the parameter to make it suffice the length.

### Prevention
Since this dApp is not using any ERC20 tokens, the smart contracts implemented are not susceptable to the Short Address Attack. However, if one needs to secure their smart contracts from this type of attack the following measure should be taken:
- **Validate** all the inputs correctly before sending them to the smart contract'
- Have the correct **parameter ordering**, since invalid orcering of parameters can cause a short address attack;
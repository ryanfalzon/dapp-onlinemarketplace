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

### Prevention

## Call To The Unknown

## Short Address Attack

### Definition
This attack is performed on third party applications that interact with the smart contracts. When passing parameters to the smart contract, these are encoded using the ABI specification of that contract. Third party applications can manipulate the encoded parameters to be shorter in length (*Normally 40 hex characters*) and thus, the EVM will be forced to place 0's at the end of the parameter to make it suffice the length.

### Prevention
Since this dApp is not using any ERC20 tokens, the smart contracts implemented are not susceptable to the Short Address Attack. However, if one needs to secure their smart contracts from this type of attack the following measure should be taken:
- **Validate** all the inputs correctly before sending them to the smart contract'
- Have the correct **parameter ordering**, since invalid orcering of parameters can cause a short address attack;
# Design Patter Decisions

## Contract Self Destruction

## Factory Contract

## Name Registry

## Mapping Iterator

Mappings in solidity are considered to be extremely useful. Essentially they are a unique key mapped to any type of value. They are considered the hash table equivalents. Mappings do not have a length or a concept of key or value set, therefore it is impossible to iterate over a mapping. This is were a mapping iterator comes in place. When possible, it is adviced to avoid iterating over a high amount of elements since as the number of elements goes up, the complexity of the iteration will increase, thus also increaings the storage cost.

Consider the following mapping:

    mapping(address => bytes32[]) public storesMappedToOwner;

A mapping iterator for that mapping would look as follows:

    // Mapping iterator for stores
    function GetStoreCount(address manager) view public returns (uint){
        return storesMappedToOwner[manager].length;
    }
    function GetStoreElementAtIndex(address manager, uint index) view public returns (bytes32, address, string memory, string memory, string memory, uint){
        bytes32[] memory stores = storesMappedToOwner[manager];
        Store memory store = storesMappedToId[stores[index]];
        return (store.id, store.owner, store.name, store.description, store.imageUrl, store.balance);
    }
    function GetStoreElement(bytes32 id) view public returns (bytes32, address, string memory, string memory, string memory, uint){
        Store memory store = storesMappedToId[id];
        return (store.id, store.owner, store.name, store.description, store.imageUrl, store.balance);
    }

This process was created for all mappings in the developed smart contracts.

## Withdrawal Pattern

### Definition

To transfer money between two address we have two options to choose from:
1. Use `address.transfer()`
2. Or use `address.send()`

The difference between these two is that the first one will throw an exception if something goes wrong during the process, while the latter will not throw an exception but will rather return false. But why does this effect code execution? Consider a list of contract address who we want to send a number of ethers. If one of these contracts have a faulty fallback function that creates an exception, execution stops and none of the remaining addresses will receive the etheres they are owed.

The withdrawal pattern helped int the development since it exposes the `WithdrawStoreBalance()` function and refunds the stores on demand, rather than refunding the stores in one call. The code snippet below illustrates this:

    // Function to withdraw store balance and send to owner
    function WithdrawStoreBalance(bytes32 id) RequireManagerStatus RequireStoreOwnerStatus(id)  public{        

        // Check if store balance is greater than 0
        uint balance = storesMappedToId[id].balance;
        require(balance > 0, "Store Balance Is 0");

        // Transfer store balance to store owner
        storesMappedToId[id].balance = 0;
        require(msg.sender.send(balance));
        emit BalanceWithdrawn(id, balance);
    }

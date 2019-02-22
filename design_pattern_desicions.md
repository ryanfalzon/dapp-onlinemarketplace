# Design Patter Decisions

## Contract Self Destruction

### Definition

Selftdestructs in Ethereum are an oepration at the EVM level, which are independent of what language or client is used. For instance, calling `selfdestruct(address)` sends all of the contract's current balance to address, and destorys the bytecode that points to that address, making the smart contract absolete. This is useful when you are finished with a contract, because it costs far less gas then just sending the baalance via a class such as `address.send(this.balance)`. It is important to note that if an interaction occurs with a contruct that has selfdestructed, **all funds are lost**.

### Use

In this assignment, a self desturuction function was inserted in both contracts, with an access modifier that allows only the administrator to call it. The code snippet below illustrates this:

```bash
// Self destruction
function DestroyContract() AuthenticateMessageSender public{
    selfdestruct(administrator);
}

// Function to check of message sender is a manager
modifier AuthenticateMessageSender(){
    require((administrator == msg.sender), "Only Administrators Are Able To Run This Function");
    _;
}
```

## Factory Contract

### Definition

A factory contract is essentially enables the deployment of child contracts also known as assets. The factory part is used to store the address of the child contract so they can be made available at any time. A common use case for this design patter would be to track sold assets such as houses and have data about that asset, such as the current owner, available at all times.

In this project, the factory contract was note utilized mainly because the data of the assets, such as the store owner, was not going to be changed. Hence a mapping design was adopted were for instance stores were defined as follows:

```bash
bytes32[] private allStores;
mapping(address => bytes32[]) public storesMappedToOwner;
mapping(bytes32 => Store) public storesMappedToId;
```
    
### Use

Where the array of `bytes32` contains a list of all store Ids, the mapping `storesMappedToOwner` contains all the stores mapped to the owner address and finally the `storesMappedToId` mapping has the store mapped to the its Id.

## Name Registry

### Definition

A named registry is beneficial when your smart contract relys on a number of other smart contracts. Having a lot of dependencies can be difficult to maintain and this is were the name registry comes in. Instead of having the addresses of a lot of contracts, we would have the address to one contract that manages all other dependencies.
This works by having a mapping between the contract address and a given name for the contract as follows `contract_name => contract_address`. The benefit of this would be, that if new versions of contracts come out, we would only need to update the address of the mapping and nothing else.

### Use

This design pattern was not used since from the two smart contracts written, only one of them has one dependency to another contract.

## Mapping Iterator

### Definition

Mappings in solidity are considered to be extremely useful. Essentially they are a unique key mapped to any type of value. They are considered the hash table equivalents. Mappings do not have a length or a concept of key or value set, therefore it is impossible to iterate over a mapping. This is were a mapping iterator comes in place. When possible, it is adviced to avoid iterating over a high amount of elements since as the number of elements goes up, the complexity of the iteration will increase, thus also increaings the storage cost.

### Use

Consider the following mapping:

```bash
mapping(address => bytes32[]) public storesMappedToOwner;
```

A mapping iterator for that mapping would look as follows:

```bash
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
```

This process was created for all mappings in the developed smart contracts.

## Withdrawal Pattern

### Definition

To transfer money between two address we have two options to choose from:
1. Use `address.transfer()`
2. Or use `address.send()`

The difference between these two is that the first one will throw an exception if something goes wrong during the process, while the latter will not throw an exception but will rather return false. But why does this effect code execution? Consider a list of contract address who we want to send a number of ethers. If one of these contracts have a faulty fallback function that creates an exception, execution stops and none of the remaining addresses will receive the etheres they are owed.

### Use

The withdrawal pattern helped in the development since it exposes the `WithdrawStoreBalance()` function and refunds the stores on demand, rather than refunding the stores in one call. The code snippet below illustrates this:

```bash
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
```

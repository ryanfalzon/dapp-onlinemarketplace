pragma solidity ^0.5.0;

import "./Marketplace.sol";

contract StoreManager{

    // Holds a stores data
    struct Store{
        bytes32 id;
        address payable owner;
        string name;
        string description;
        string imageUrl;
        uint balance;
    }

    // Holds a products data
    struct Product{
        bytes32 id;
        bytes32 storeId;
        string name;
        string description;
        string imageUrl;
        uint pricePerUnit;
        uint availableUnits;
    }

    // Holds a receipt data
    struct Receipt{
        bytes32 id;
        bytes32 productId;
        uint quantity;
        uint totalPrice;
        address buyer;
    }

    // Properties
    address payable private administrator;
    Marketplace private marketplace;
    bytes32[] private allStores;
    mapping(address => bytes32[]) public storesMappedToOwner;
    mapping(bytes32 => Store) public storesMappedToId;
    mapping(bytes32 => bytes32[]) public productsMappedToStore;
    mapping(bytes32 => Product) public productsMappedToId;
    mapping(bytes32 => Receipt) public receiptsMappedToId;
    mapping(address => bytes32[]) public receiptsMappedToOwner;

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

    // Mapping iterator for products
    function GetProductsCount(bytes32 store) view public returns (uint){
        return productsMappedToStore[store].length;
    }
    function GetProductElementAtIndex(bytes32 store, uint index) view public returns (bytes32, bytes32, string memory, string memory, string memory, uint, uint){
        bytes32[] memory products = productsMappedToStore[store];
        Product memory product = productsMappedToId[products[index]];
        return (product.id, product.storeId, product.name, product.description, product.imageUrl, product.pricePerUnit, product.availableUnits);
    }
    function GetProductElement(bytes32 id) view public returns (bytes32, bytes32, string memory, string memory, string memory, uint, uint){
        Product memory product = productsMappedToId[id];
        return (product.id, product.storeId, product.name, product.description, product.imageUrl, product.pricePerUnit, product.availableUnits);
    }

    // Contract events
    event StoreCreated(bytes32 id, address owner, string name, string description, string imageUrl, uint balance);
    event StoreDeleted(bytes32 id);
    event ProductCreated(bytes32 id, bytes32 storeId, string name, string description, string imageUrl, uint pricePerUnit, uint availableUnits);
    event ProductDeleted(bytes32 id, bytes32 storeId);
    event ProductSold(bytes32 id, bytes32 storeId, uint quantity, uint totalPrice);
    event BalanceWithdrawn(bytes32 storeId, uint total);

    // Constructor
    constructor(address marketplaceAddress) public{
        administrator = msg.sender;
        marketplace = Marketplace(marketplaceAddress);
    }

    // Self destruction
    function DestroyContract() RequireContractOwnerStatus public{
        selfdestruct(administrator);
    }

    // Function to create a new store
    function CreateStore(string memory name, string memory description, string memory imageUrl) RequireManagerStatus public returns (bytes32){
	
        // Create the store
        bytes32 id = keccak256(abi.encodePacked(msg.sender, name, description, imageUrl, now));
        Store memory store = Store(id, msg.sender, name, description, imageUrl, 0);

        // Put store in respective arrays
        storesMappedToOwner[msg.sender].push(store.id);
        storesMappedToId[store.id] = store;
        allStores.push(store.id);

        // Emit event that the contract has successfully created the store
        emit StoreCreated(id, msg.sender, name, description, imageUrl, 0);
        return store.id;
    }

    // Function to delete a store
    function DeleteStore(bytes32 id) RequireManagerStatus RequireStoreOwnerStatus(id) public{

		// Perform checks
		require(keccak256(abi.encodePacked(storesMappedToId[id].name)) != keccak256(abi.encodePacked("")), "Store does not exist");
		
        // Withdraw balance of store
        uint storeBalance = storesMappedToId[id].balance;
        if(storeBalance > 0){
            msg.sender.transfer(storeBalance);
            emit BalanceWithdrawn(id, storeBalance);
        }

        // Find all products of the store
        bytes32[] storage storeProducts = productsMappedToStore[id];

        // Delete all store products from the mapping array
        for(uint i = 0; i < storeProducts.length; i++){
            delete productsMappedToId[storeProducts[i]];
            delete productsMappedToStore[storeProducts[i]];
        }

        // Delete the store from the mapping array between stores and owners
        uint storeCount = storesMappedToOwner[msg.sender].length;
        for(uint i = 0; i < storeCount; i++){
            if(storesMappedToOwner[msg.sender][i] == id){
                delete storesMappedToOwner[msg.sender][i];
                break;
            }
        }

        // Delete the store from the mapping array between stores and ids
        delete storesMappedToId[id];

        // Delete store from array of all stores
        storeCount = allStores.length;
        for(uint i = 0; i < storeCount; i++){
            if(allStores[i] == id){
                delete allStores[i];
                break;
            }
        }

        // Emit event that the contract has successfully deleted the store
        emit StoreDeleted(id);
    }

    // Function to return all stores who are assigned to an owner
    function GetAllStoresByOwner(address storeOwner) RequireManagerStatus view public returns(bytes32[] memory){
        return storesMappedToOwner[storeOwner];
    }

    // Function to get all receipts for a store
    function GetAllReceipts(address storeOwner) RequireManagerStatus view public returns(bytes32[] memory){
        return receiptsMappedToOwner[storeOwner];
    }

    // Function to return all stores
    function GetAllStores() view public returns(bytes32[] memory){
        return allStores;
    }

    // Function to create a new product
    function CreateProduct(bytes32 storeId, string memory name, string memory description, string memory imageUrl, uint pricePerUnit, uint availableUnits) RequireManagerStatus RequireStoreOwnerStatus(storeId) public returns (bytes32){
		
		// Create the product
        bytes32 id = keccak256(abi.encodePacked(msg.sender, storeId, name, description, imageUrl, pricePerUnit, availableUnits, now));
        Product memory product = Product(id, storeId, name, description, imageUrl, pricePerUnit, availableUnits);

        // Put store in respective arrays
        productsMappedToStore[storeId].push(id);
        productsMappedToId[id] = product;

        emit ProductCreated(id, storeId, name, description, imageUrl, pricePerUnit, availableUnits);
        return product.id;
    }

    // Function to delete a product
    function DeleteProduct(bytes32 id, bytes32 storeId) RequireManagerStatus RequireStoreOwnerStatus(storeId) public{
	
		// Perform checks
        require(keccak256(abi.encodePacked(productsMappedToId[id].name)) != keccak256(abi.encodePacked("")), "Product does not exist");
		
        // Find all products of the store
        bytes32[] storage storeProducts = productsMappedToStore[storeId];

        // Delete product from mappings
        for(uint i = 0; i < storeProducts.length; i++){
            if(storeProducts[i] == id){
                delete productsMappedToStore[storeId][i];
                delete productsMappedToId[id];

                // Emit event that the contract has successfully deleted the product
                emit ProductDeleted(id, storeId);
            }
        }
    }

    // Function that returns all products
    function GetAllProducts(bytes32 storeId) view public returns(bytes32[] memory){
        return productsMappedToStore[storeId];
    }

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

        // Create receipt and store it
        bytes32 receiptId = keccak256(abi.encodePacked(msg.sender, id, quantity, totalAmount, msg.sender, now));
        Receipt memory receipt = Receipt(receiptId, id, quantity, totalAmount, msg.sender);

        // Put receipt in respective arrays
        receiptsMappedToOwner[storesMappedToId[storeId].owner].push(receipt.id);
        receiptsMappedToId[receipt.id] = receipt;
    }

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

    // Fallback function
    function() external {
        revert("Please use the correct function name");
    }

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

    // Function to check if message sender is the contract owner
    modifier RequireContractOwnerStatus(){
        require(msg.sender == administrator);
        _;
    }
}
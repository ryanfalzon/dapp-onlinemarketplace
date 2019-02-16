pragma solidity ^0.5.0;

import "./Marketplace.sol";

contract StoreManager{

    // Holds a stores data
    struct Store{
        bytes32 id;
        address owner;
        string name;
        string description;
        string imageUrl;
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

    // Properties
    Marketplace private marketplace;
    bytes32[] private allStores;
    mapping(address => bytes32[]) public storesMappedToOwner;
    mapping(bytes32 => Store) public storesMappedToId;
    mapping(bytes32 => bytes32[]) public productsMappedToStore;
    mapping(bytes32 => Product) public productsMappedToId;

    // Contract events
    event StoreCreated(bytes32 id, address owner, string name, string description, string imageUrl);
    event StoreDeleted(bytes32 id);
    event ProductCreated(bytes32 id, bytes32 storeId, string name, string description, string imageUrl, uint pricePerUnit, uint availableUnits);
    event ProductDeleted(bytes32 id, bytes32 storeId);
    event ProductSold(bytes32 id, bytes32 storeId, uint pricePerUnit, uint quantity, uint totalPrice, address buyer, uint newQuantity);

    // Constructor
    constructor(address marketplaceAddress) public{
        marketplace = Marketplace(marketplaceAddress);
    }

    // Function to create a new store
    function CreateStore(string memory name, string memory description, string memory imageUrl) RequireManagerStatus public returns (bytes32){

        // Create the store
        bytes32 id = keccak256(abi.encodePacked(msg.sender, name, description, imageUrl, now));
        Store memory store = Store(id, msg.sender, name, description, imageUrl);

        // Put store in respective arrays
        storesMappedToOwner[msg.sender].push(store.id);
        storesMappedToId[store.id] = store;
        allStores.push(store.id);

        // Emit event that the contract has successfully created the store
        emit StoreCreated(id, msg.sender, name, description, imageUrl);
        return store.id;
    }

    // Function to delete a store
    function DeleteStore(bytes32 id) RequireStoreOwnerStatus(id) public{

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

    // Function to return all stores
    function GetAllStores() view public returns(bytes32[] memory){
        return allStores;
    }

    // Function to return the amount of stores that are available
    function GetStoreAmount() view public returns(uint){
        return allStores.length;
    }

    // Function to create a new product
    function CreateProduct(bytes32 storeId, string memory name, string memory description, string memory imageUrl, uint pricePerUnit, uint availableUnits) RequireManagerStatus RequireStoreOwnerStatus(storeId) public returns (bytes32){
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
}
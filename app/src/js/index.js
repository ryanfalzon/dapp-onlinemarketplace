require('babel-polyfill');
import { default as Web3 } from 'web3';
import { default as contract } from 'truffle-contract';
import MarketplaceArtifact from "../../../build/contracts/Marketplace.json";
import StoreManagerArtifact from "../../../build/contracts/StoreManager.json";

const App = {
    web3: new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545')),
    account: null,
    marketplace: null,
    storeManager: null,

    start: async function(){
        try{
            var response = await this.web3.eth.getAccounts();
            this.account = response[0];

            this.marketplace = await contract(MarketplaceArtifact);
            this.marketplace.setProvider(web3.currentProvider);
            this.marketplace.defaults({
              gas: 4712388,
              gasPrice: 100000000000
            });
  
            this.storeManager = await contract(StoreManagerArtifact);
            this.storeManager.setProvider(web3.currentProvider);
            this.storeManager.defaults({
              gas: 4712388,
              gasPrice: 100000000000
            });

            await this.initView();
        }
        catch(error){
            console.error(error);
        }
    },

    initView: async function(){
        try{
            var instance = await this.marketplace.deployed();

            var checkAdminResponse = await instance.CheckAdministrator(this.account);
            if(!checkAdminResponse){
                $('#adminViewButton').attr('style', 'display: none;');
            }

            var checkManagerResponse = await instance.CheckManager(this.account);
            if(!checkManagerResponse){
                $('#managerViewButton').attr('style', 'display: none;');
            }
        }
        catch(error){
            console.error(error);
        }
    },

    addStoreManager: async function(address){
        try{
            var instance = await this.marketplace.deployed();
            var response = await instance.AddManager(address, {from: this.account});
            return response;
        }
        catch(error){
            console.error(error);
            return false;
        }
    },

    removeStoreManager: async function(address){
        try{
            var instance = await this.marketplace.deployed();
            var response = await instance.RemoveManager(address, {from: this.account});
            return response;
        }
        catch(error){
            console.error(error);
            return false;
        }
    },

    getStoreManagers: async function(){
        try{
            var instance = await this.marketplace.deployed();
            var response = await instance.GetAllManagers();
            var managers = [];
            response.forEach(function(manager){
                instance.managers(manager).then(function(check){
                    if(check == true){
                        managers.push(manager);
                    }
                });
            });

            return managers;
        }
        catch(error){
            console.error(error);
            return false;
        }
    },

    addStore: async function(store){
        try{
            var instance = await this.storeManager.deployed();
            var response = await instance.CreateStore(store.name, store.description, store.imageUrl, {from: this.account});
            return response;
        }
        catch(error){
            console.error(error);
            return false;
        }
    },

    removeStore: async function(storeId){
        try{
            var instance = await this.storeManager.deployed();
            var response = await instance.DeleteStore(storeId, {from: this.account});
            return response;
        }
        catch(error){
            console.error(error);
            return false;
        }
    },

    getStore: async function(storeId){
        try{
            var instance = await this.storeManager.deployed();
            var response = await instance.storesMappedToId(storeId);
            return response;
        }
        catch(error){
            console.error(error);
            return false;
        }
    },

    getStoresByOwner: async function(){
        try{
            var instance = await this.storeManager.deployed();
            var response = await instance.GetAllStoresByOwner(this.account);
            var stores = [];
            response.forEach(function(storeId){
                instance.storesMappedToId(storeId).then(function(store){
                    if(store.name !== ''){
                        stores.push(store);
                    }
                });
            });

            return stores;
        }
        catch(error){
            console.error(error);
            return false;
        }
    },

    getAllStores: async function(){
        try{
            var instance = await this.storeManager.deployed();
            var response = await instance.GetAllStores();
            var stores = [];
            response.forEach(function(storeId){
                instance.storesMappedToId(storeId).then(function(store){
                    if(store.name !== ''){
                        stores.push(store);
                    }
                });
            });

            return stores;
        }
        catch(error){
            console.error(error);
            return false;
        }
    },

    addProduct: async function(product){
        try{
            var instance = await this.storeManager.deployed();
            var response = await instance.CreateProduct(product.storeId, product.name, product.description, product.imageUrl, product.pricePerUnit, product.quantity, {from: this.account});
            return response;
        }
        catch(error){
            console.error(error);
            return false;
        }
    },

    removeProduct: async function(productId, storeId){
        try{
            var instance = await this.storeManager.deployed();
            var response = await instance.DeleteProduct(productId, storeId, {from: this.account});
            return response;
        }
        catch(error){
            console.error(error);
            return false;
        }
    },

    getProductsByStore: async function(storeId){
        try{
            var instance = await this.storeManager.deployed();
            var response = await instance.GetAllProducts(storeId);
            var products = [];
            response.forEach(function(productId){
                instance.productsMappedToId(productId).then(function(product){
                    if(product.name !== ''){
                        products.push(product);
                    }
                });
            });

            return products;
        }
        catch(error){
            console.error(error);
            return false;
        }
    },

    buyProduct: async function(transaction){
        try{
            var instance = await this.storeManager.deployed();
            var response = await instance.BuyProduct(transaction.id, transaction.storeId, transaction.quantity, transaction.totalPrice, transaction.newQuantity, {from: this.account, value: transaction.totalPrice});
            return response;
        }
        catch(error){
            console.error(error);
            return false;
        }
    },

    refreshBalance: async function(){
        try{

            return true;
        }
        catch(error){
            console.error(error);
            return false;
        }
    }
}

window.App = App;
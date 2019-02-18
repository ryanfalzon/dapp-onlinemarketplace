require('babel-polyfill');

// Import libraries
import { default as Web3 } from 'web3';

// Import smart contract artifacts
import MarketplaceArtifact from '../../../build/contracts/Marketplace.json';
import StoreManagerArtifact from '../../../build/contracts/StoreManager.json';

// Import views
import HomeView from '../home.html';
import AdministratorView from '../administrator.html';
import ManageStoresView from '../manageStores.html';
import ManageProductsView from '../manageProducts.html';
import MarketplaceView from '../marketplace.html';

const App = {
    web3: null,
    account: null,
    marketplace: null,
    storeManager: null,
    
    start: async function () {
        const { web3 } = this;
        try {
            // Get Contract instance
            const networkId = await web3.eth.net.getId();
            var deployedNetwork = MarketplaceArtifact.networks[networkId];
            this.marketplace = new web3.eth.Contract(
                MarketplaceArtifact.abi,
                deployedNetwork.address,
            );
            deployedNetwork = StoreManagerArtifact.networks[networkId];
            this.storeManager = new web3.eth.Contract(
                StoreManagerArtifact.abi,
                deployedNetwork.address
            );

            // Get account
            const accounts = await web3.eth.getAccounts();
            this.account = accounts[0];
        }
        catch (error) {
            console.error(error);
        }
    },

    initView: async function () {
        try {
            var instance = await this.marketplace.deployed();

            var checkAdminResponse = await instance.CheckAdministrator(this.account);
            if (!checkAdminResponse) {
                $('#adminViewButton').attr('style', 'display: none;');
            }

            var checkManagerResponse = await instance.CheckManager(this.account);
            if (!checkManagerResponse) {
                $('#managerViewButton').attr('style', 'display: none;');
            }
        }
        catch (error) {
            console.error(error);
        }
    },

    changeView: async function (page) {
        if (page === 'administrator') {
            document.getElementById('content').innerHTML = AdministratorView;
            await App.getStoreManagers();
        }
        else if (page === 'manageStores') {
            document.getElementById('content').innerHTML = ManageStoresView;
            await App.getStoresByOwner();
        }
        else if (page === 'manageProducts') {
            document.getElementById('content').innerHTML = ManageProductsView;
        }
        else if (page === 'marketplace') {
            document.getElementById('content').innerHTML = MarketplaceView;
        }
        else {
            document.getElementById('content').innerHTML = HomeView;
        }
    },

    addStoreManager: async function () {
        var address = document.getElementById('addressField').value;
        try {
            const { AddManager } = this.marketplace.methods;
            const response = await AddManager(address).call({ from: this.account });
            console.log(response);

            await App.getStoreManagers();
        }
        catch (error) {
            console.error(error);
            return false;
        }
    },

    removeStoreManager: async function (address) {
        console.log(address);
        try {
            const { RemoveManager } = this.marketplace.methods;
            const response = await RemoveManager(address).call({ from: this.account });
            console.log(response);
        }
        catch (error) {
            console.error(error);
            return false;
        }
    },

    getStoreManagers: async function () {
        try {
            const { GetAllManagers } = this.marketplace.methods;
            const allManagers = await GetAllManagers().call({ from: this.account });
            var managers = [];
            allManagers.forEach(function (manager) {
                const { managers } = this.marketplace.methods;
                managers(manager).call({ from: this.account }).then(function (response) {
                    if (response === true) {
                        managers.push(manager);
                    }
                });
            });

            document.getElementById('storeManagerList').innerHTML = '';
            managers.forEach(function (manager) {
                document.getElementById('storeManagerList').innerHTML += `
                    <li class="list-group-item">
	                    ${manager}
	                    <span class="pull-right">
		                    <button class="btn btn-xs btn-danger" onclick="App.removeStoreManager('${manager}')">Remove <span class="glyphicon glyphicon-trash"></span></button>
	                    </span>
                    </li>
                `;
            });
        }
        catch (error) {
            console.error(error);
            return false;
        }
    },

    addStore: async function (store) {
        App.getStoresByOwner();
        var name = document.getElementById('addressField').value;
        var description = document.getElementById('addressField').value;
        var imageUrl = document.getElementById('addressField').value;
        try {
            const { CreateStore } = this.storeManager.methods;
            const response = await CreateStore(name, description, imageUrl).call({ from: this.account });
            console.log(response);

            await App.getStoresByOwner();
        }
        catch (error) {
            console.error(error);
            return false;
        }
    },

    removeStore: async function (storeId) {
        try {
            var instance = await this.storeManager.deployed();
            var response = await instance.DeleteStore(storeId, { from: this.account });
            return response;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    },

    getStore: async function (storeId) {
        try {
            var instance = await this.storeManager.deployed();
            var response = await instance.storesMappedToId(storeId);
            return response;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    },

    getStoresByOwner: async function () {
        try {
            const { GetAllStoresByOwner } = this.storeManager.methods;
            const allStores = await GetAllStoresByOwner(this.account).call({ from: this.account });
            console.log(allStores);
            var stores = [];
            allStores.forEach(function (storeId) {
                const { storesMappedToId } = this.storeManager.methods;
                storesMappedToId(storeId).call({ from: this.account }).then(function (response) {
                    if (response === true) {
                        stores.push(store);
                    }
                });
            });

            stores.push("libh");
            stores.push("JBNIUB");

            document.getElementById('storeList').innerHTML = '';
            stores.forEach(function (store) {
                document.getElementById('storeList').innerHTML += `
                    <li class="list-group-item">
	                    ${store.name} (Ξ${store.balance.words[0]})
	                    <span class="pull-right">
		                    <button class="btn btn-xs btn-info" onclick="App.removeStore('${store}')" ng-disabled="store.balance.words[0] == 0">Withdraw <span class="glyphicon glyphicon-download-alt"></span></button>
		                    <button class="btn btn-xs btn-danger" onclick="App.withdrawBalance('${store}')">Remove <span class="glyphicon glyphicon-trash"></span></button>
	                    </span>
                    </li>
                `;
            });
        }
        catch (error) {
            console.error(error);
            return false;
        }
    },

    getAllStores: async function () {
        try {
            var instance = await this.storeManager.deployed();
            var response = await instance.GetAllStores();
            var stores = [];
            response.forEach(function (storeId) {
                instance.storesMappedToId(storeId).then(function (store) {
                    if (store.name !== '') {
                        stores.push(store);
                    }
                });
            });

            return stores;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    },

    addProduct: async function (product) {
        try {
            var instance = await this.storeManager.deployed();
            var response = await instance.CreateProduct(product.storeId, product.name, product.description, product.imageUrl, product.pricePerUnit, product.quantity, { from: this.account });
            return response;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    },

    removeProduct: async function (productId, storeId) {
        try {
            var instance = await this.storeManager.deployed();
            var response = await instance.DeleteProduct(productId, storeId, { from: this.account });
            return response;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    },

    getProductsByStore: async function (storeId) {
        try {
            var instance = await this.storeManager.deployed();
            var response = await instance.GetAllProducts(storeId);
            var products = [];
            response.forEach(function (productId) {
                instance.productsMappedToId(productId).then(function (product) {
                    if (product.name !== '') {
                        products.push(product);
                    }
                });
            });

            return products;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    },

    buyProduct: async function (transaction) {
        try {
            var instance = await this.storeManager.deployed();
            var response = await instance.BuyProduct(transaction.id, transaction.storeId, transaction.quantity, transaction.totalPrice, transaction.newQuantity, { from: this.account, value: transaction.totalPrice });
            return response;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    },

    refreshBalance: async function () {

    }
};

window.App = App;

window.addEventListener("load", function () {
    App.web3 = new Web3(
        new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
    );

    App.start();
}); 
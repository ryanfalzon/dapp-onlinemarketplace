// Import libraries
import Web3 from "web3";

// Import smart contracts
import marketplaceArtifact from "../../../build/contracts/Marketplace.json";
import storeManagerArtifact from "../../../build/contracts/StoreManager.json";

// Import HTML views
import HomeView from '../home.html';
import AdministratorView from '../administrator.html';
import ManageStoresView from '../manageStores.html';
import ManageProductsView from '../manageProducts.html';
import MarketplaceView from '../marketplace.html';
import StoreView from '../store.html';
import ForbiddenView from '../forbidden.html';

const App = {
  web3: null,
  account: null,
  marketplace: null,
  storeManager: null,

  start: async function () {
    const { web3 } = this;

    try {
      // Get contract instance - Marketplace
      const networkId = await web3.eth.net.getId();
      const deployedNetworkMarketplace = marketplaceArtifact.networks[networkId];
      this.marketplace = new web3.eth.Contract(
        marketplaceArtifact.abi,
        deployedNetworkMarketplace.address,
      );

      // Get contract instance - StoreManager
      const deployedNetworkStoreManager = storeManagerArtifact.networks[networkId];
      this.storeManager = new web3.eth.Contract(
        storeManagerArtifact.abi,
        deployedNetworkStoreManager.address,
      );

      // Get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];
      console.log(this.account);

      // Set the view
      await this.initView();
    }
    catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  initView: async function () {
    try {
      var checkAdminResponse = await this.checkAdminStatus();
      if (!checkAdminResponse) {
          $('#adminViewButton').attr('style', 'display: none;');
      }

      var checkManagerResponse = await this.checkManagerStatus();
      if (!checkManagerResponse) {
          $('#managerViewButton').attr('style', 'display: none;');
      }
    }
    catch (error) {
        console.error(error);
    }
  },

  checkAdminStatus: async function(){
    // Call the smart contract function
    const { CheckAdministrator } = this.marketplace.methods;
    const response = await CheckAdministrator(this.account).call({ from: this.account });
    console.log(response);
    return response;
  },

  checkManagerStatus: async function(){
    // Call the smart contract function
    const { CheckManager } = this.marketplace.methods;
    const response = await CheckManager(this.account).call({ from: this.account });
    return response;
  },

  addManager: async function () {
    try {
      // Get the address from the text field
      const address = document.getElementById('addressField').value;

      // Call the smart contract function
      const { AddManager } = this.marketplace.methods;
      const response = await AddManager(address).send({ from: this.account });
      console.log(response);

      // Refresh manager list
      document.getElementById('addStoreManagerForm').reset();
      this.refreshManagerList();
    }
    catch (error) {
      console.error(error);
    }
  },

  removeStoreManager: async function (address) {
    try{
      // Call the smart contract function
      const { RemoveManager } = this.marketplace.methods;
      const response = await RemoveManager(address).send({ from: this.account });
      console.log(response);

      // Refresh manager list
      this.refreshManagerList();
    }
    catch(error){
      console.error(error);
    }
  },

  refreshManagerList: async function () {
    try {
      // Get all managers that were ever created
      const { GetAllManagers } = this.marketplace.methods;
      const allManagers = await GetAllManagers().call({ from: this.account });
      const managerList = [];

      // Check if returned managers are still managers
      for(let i = 0; i < allManagers.length; i++){
        const { managers } = App.marketplace.methods;
        const managerCheck = await managers(allManagers[i]).call({from: this.account});
        if(managerCheck === true){
          managerList.push(allManagers[i]);
        }
      }

      // Print manager list in the DOM
      document.getElementById('storeManagerList').innerHTML = '';
      managerList.forEach(function (manager) {
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
    catch(error){
      console.error(error);
    }
  },

  addStore: async function () {
    try {
      // Get the address from the text field
      const name = document.getElementById('nameField').value;
      const description = document.getElementById('descriptionField').value;
      const imageUrl = document.getElementById('imageUrlField').value;

      // Call the smart contract function
      const { CreateStore } = this.storeManager.methods;
      const response = await CreateStore(name, description, imageUrl).send({ from: this.account });
      console.log(response);

      // Refresh manager list
      document.getElementById('addStoreForm').reset();
      this.refreshOwnerStoreList('manageStores');
    }
    catch (error) {
      console.error(error);
    }
  },

  removeStore: async function (storeId) {
    try{
      // Call the smart contract function
      const { DeleteStore } = this.storeManager.methods;
      const response = await DeleteStore(storeId).send({ from: this.account });
      console.log(response);

      // Refresh manager list
      this.refreshOwnerStoreList('manageStores');
    }
    catch(error){
      console.error(error);
    }
  },

  refreshOwnerStoreList: async function (page) {
    try {
      // Get all managers that were ever created
      const { GetAllStoresByOwner } = this.storeManager.methods;
      const allStores = await GetAllStoresByOwner(this.account).call({ from: this.account });
      const storesList = [];

      // Check if returned managers are still managers
      for(let i = 0; i < allStores.length; i++){
        const { storesMappedToId  } = App.storeManager.methods;
        const storeCheck = await storesMappedToId(allStores[i]).call({from: this.account});
        if(storeCheck.name !== ''){
          storesList.push(storeCheck);
        }
      }

      // Print manager list in the DOM
      if(page === 'manageStores'){
        document.getElementById('storeList').innerHTML = '';
        storesList.forEach(function (store) {
            document.getElementById('storeList').innerHTML += `
                <li class="list-group-item">
                  ${store.name} (Ξ${store.balance})
                  <span class="pull-right">
                    <button class="btn btn-xs btn-info" onclick="App.removeStore('${store.id}')" ng-disabled="store.balance.words[0] == 0">Withdraw <span class="glyphicon glyphicon-download-alt"></span></button>
                    <button class="btn btn-xs btn-danger" onclick="App.removeStore('${store.id}')">Remove <span class="glyphicon glyphicon-trash"></span></button>
                  </span>
                </li>
            `;
        });
      }
      else if(page === 'manageProducts'){
        document.getElementById('storeField').innerHTML = '';
        document.getElementById('storeList').innerHTML = '';
        storesList.forEach(function(store){
          document.getElementById('storeField').innerHTML += `
            <option value="${store.id}">${store.name}</option>
          `;
          document.getElementById('storeList').innerHTML += `
            <option value="${store.id}">${store.name}</option>
          `;
        });
      }
    }
    catch(error){
      console.error(error);
    }
  },

  addProduct: async function () {
    try {
      // Get the address from the text field
      const store = document.getElementById('storeField').value;
      const name = document.getElementById('nameField').value;
      const description = document.getElementById('descriptionField').value;
      const imageUrl = document.getElementById('imageUrlField').value;
      const price = document.getElementById('priceField').value;
      const quantity = document.getElementById('quantityField').value;

      // Call the smart contract function
      const { CreateProduct } = this.storeManager.methods;
      const response = await CreateProduct(store, name, description, imageUrl, price, quantity).send({ from: this.account });
      console.log(response);

      // Refresh manager list
      document.getElementById('addProductForm').reset();
      this.refreshProductList('manageProducts');
    }
    catch (error) {
      console.error(error);
    }
  },

  removeProduct: async function (productId, storeId) {
    try{
      // Call the smart contract function
      const { DeleteProduct } = this.storeManager.methods;
      const response = await DeleteProduct(productId, storeId).send({ from: this.account });
      console.log(response);

      // Refresh manager list
      this.refreshProductList('manageProducts');
    }
    catch(error){
      console.error(error);
    }
  },

  refreshProductList: async function (page) {
    try {
      // Get the address from the text field
      var store = '';
      if(page === 'manageProducts'){
        store = document.getElementById('storeList').value;
      }
      else if(page === 'store'){
        store = localStorage['selectedStore']
      }
      
      // Get all managers that were ever created
      const { GetAllProducts } = this.storeManager.methods;
      const allProducts = await GetAllProducts(store).call({ from: this.account });
      const productsList = [];

      // Check if returned managers are still managers
      for(let i = 0; i < allProducts.length; i++){
        const { productsMappedToId  } = App.storeManager.methods;
        const productCheck = await productsMappedToId(allProducts[i]).call({from: this.account});
        if(productCheck.name !== ''){
          productsList.push(productCheck);
        }
      }
      
      // Print manager list in the DOM
      if(page === 'manageProducts'){
        document.getElementById('productsList').innerHTML = '';
        productsList.forEach(function (product) {
            document.getElementById('productsList').innerHTML += `
              <li class="list-group-item">
                  ${product.name} - ${product.availableUnits} Left
                  <span class="pull-right">
                      <button class="btn btn-xs btn-danger" onclick="App.removeProduct('${product.id}', '${product.storeId}')">Remove <span class="glyphicon glyphicon-trash"></span></button>
                  </span>
              </li>
            `;
        });
      }
      else if(page === 'store'){
        // Set the store name
        const { storesMappedToId } = this.storeManager.methods;
        const storeDetails = await storesMappedToId(store).call({ from: this.account });

        document.getElementById('storeName').innerHTML = storeDetails.name;

        document.getElementById('productList').innerHTML = '';
        for(let i = 0; i < productsList.length; i++){
          document.getElementById('productList').innerHTML += `
            <li class="list-group-item">
              <div style="width: 30%; display: inline-block; vertical-align: top">
                <img src="${productsList[i].imageUrl}" style="max-height: 100%; max-width: 100%">
              </div>
      
              <div style="width: 69%; display: inline-block; padding-left: 20px">
                <h3>${productsList[i].name}</h3>
                <p>${productsList[i].description}</p>
                <p>Ξ${productsList[i].pricePerUnit}</p>
                <div class="form-group row">
                  <div class="col-xs-4">
                    <input type="number" class="form-control" id="quantity${i}" placeholder="Enter Quantity" min="1" max="${productsList[i].availableUnits}">
                  </div>
                  <button type="button" class="btn btn-success" onclick="App.buyProduct('${productsList[i].id}', '${productsList[i].storeId}', ${i}, ${productsList[i].pricePerUnit}, ${productsList[i].availableUnits})">Buy <span class="glyphicon glyphicon-shopping-cart"></span></button>
                </div>
              </div>
            </li>
          `;
        };
      }
    }
    catch(error){
      console.error(error);
    }
  },

  refreshStoreList: async function(){
    try {
      // Get all managers that were ever created
      const { GetAllStores } = this.storeManager.methods;
      const allStores = await GetAllStores().call({ from: this.account });
      const storeList = [];

      // Check if returned managers are still managers
      for(let i = 0; i < allStores.length; i++){
        const { storesMappedToId  } = App.storeManager.methods;
        const store = await storesMappedToId(allStores[i]).call({from: this.account});
        if(store.name !== ''){
          storeList.push(store);
        }
      }

      console.log(storeList);

      // Print store list in the DOM
      document.getElementById('storeList').innerHTML = '';
      storeList.forEach(function (store) {
          document.getElementById('storeList').innerHTML += `
            <div class="col-lg-4">
              <img class="img-circle" src="${store.imageUrl}" alt="Generic placeholder image" width="140" height="140">
              <h2>${store.name}</h2>
              <p>${store.description}</p>
              <button type="button" class="btn btn-primary" onclick="App.redirectToStore('${store.id}')">View Store <span class="glyphicon glyphicon-chevron-right"></span></button>
            </div>
          `;
      });
    }
    catch(error){
      console.error(error);
    }
  },

  redirectToStore: async function(storeId){
    window.location.hash = 'store';
    localStorage['selectedStore'] = storeId;
  },

  buyProduct: async function(productId, storeId, quantityFieldId, pricePerUnit, availableUnits){
    try {
      // Get the address from the text field
      const quantity = document.getElementById('quantity' + quantityFieldId).value;
      const totalPrice = pricePerUnit * quantity;
      const newQuantity = availableUnits - quantity;

      // Call the smart contract function
      const { BuyProduct } = this.storeManager.methods;
      const response = await BuyProduct(productId, storeId, quantity, totalPrice, newQuantity).send({ from: this.account, value: totalPrice });
      console.log(response);
    }
    catch (error) {
      console.error(error);
    }
  }
};

window.App = App;

window.addEventListener("load", function () {
  if (window.ethereum) {
    // Use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable();
  }
  else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:8545.",
    );
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
    );
  }

  location.hash = '';
  App.start();
});

window.addEventListener("hashchange", async function(){
  if (location.hash === '#administrator') {
    var response = await App.checkAdminStatus();
    if(response === true){
      document.getElementById('content').innerHTML = AdministratorView;
      await App.refreshManagerList();
    }
    else{
      document.getElementById('content').innerHTML = ForbiddenView;
    }
  }
  else if (location.hash === '#manageStores') {
    var response = await App.checkManagerStatus();
    if(response === true){
      document.getElementById('content').innerHTML = ManageStoresView;
      await App.refreshOwnerStoreList('manageStores');
    }
    else{
      document.getElementById('content').innerHTML = ForbiddenView;
    }
  }
  else if (location.hash === '#manageProducts') {
    var response = await App.checkManagerStatus();
    if(response === true){
      document.getElementById('content').innerHTML = ManageProductsView;
      await App.refreshOwnerStoreList('manageProducts');
      await App.refreshProductList('manageProducts');
    }
    else{
      document.getElementById('content').innerHTML = ForbiddenView;
    }
  }
  else if (location.hash === '#marketplace') {
    document.getElementById('content').innerHTML = MarketplaceView;
    await App.refreshStoreList();
  }
  else if (location.hash === '#store') {
    document.getElementById('content').innerHTML = StoreView;
    await App.refreshProductList('store');
  }
  else if (location.hash === '#home') {
    document.getElementById('content').innerHTML = HomeView;
  }
  else {
    document.getElementById('content').innerHTML = HomeView;
  }
});

var app = angular.module("onlineMarket", ["ngRoute"]);

app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            template: require("../home.html")
        })
        .when("/admin", {
            template: require("../administrator.html"),
            controller: "administratorController"
        })
        .when("/manageStores", {
            template: require("../manageStores.html"),
            controller: "manageStoresController"
        })
        .when("/manageProducts", {
            template: require("../manageProducts.html"),
            controller: "manageProductsController"
        })
        .when("/marketplace", {
            template: require("../marketplace.html"),
            controller : "marketplaceController"
        })
        .when("/store/:store_id", {
            template: require("../store.html"),
            controller: "storeController"
        })
        .otherwise({
            template: "<h1>None</h1><p>Nothing has been selected</p>"
        });
});

app.controller("administratorController", function ($scope, $timeout, $q){
    $scope.address = "";
    $scope.managers = {content: null};
    $scope.counter = 0;

    $scope.AddStoreManager = async function(){
        var response = await App.addStoreManager($scope.address);
        console.log(response);
        $scope.address = "";
        await $scope.RefreshManagerList();
    };

    $scope.RemoveStoreManager = async function(address){
        var response = await App.removeStoreManager(address);
        console.log(response);
        await $scope.RefreshManagerList();
    };
    
    $scope.RefreshManagerList = async function(){
        var response = await App.getStoreManagers();
        console.log(response);
        $scope.managers.content = response;
    };

    $scope.Setup = async function(){
        await App.start();
        await $scope.RefreshManagerList();
    };

    $scope.Setup();
});

app.controller("manageStoresController", function ($scope, $http){
    $scope.name = "";
    $scope.description = "";
    $scope.imageUrl = "";
    $scope.stores = [];

    $scope.AddStore = async function(){
        var data = {
            name: $scope.name,
            description: $scope.description,
            imageUrl: $scope.imageUrl
        }

        var response = await App.addStore(data);
        console.log(response);
        $scope.name = "";
        $scope.description = "";
        $scope.imageUrl = "";
        await $scope.RefreshStoreList();
    };

    $scope.RemoveStore = async function(storeId){
        var response = await App.removeStore(storeId);
        console.log(response);
        await $scope.RefreshStoreList();
    };

    $scope.RefreshStoreList = async function(){
        var response = await App.getStoresByOwner();
        $scope.stores = response;
        console.log(response);
    };

    $scope.Setup = async function(){
        await App.start();
        $scope.RefreshStoreList();
    };

    $scope.Setup();
});

app.controller("manageProductsController", function ($scope, $http){
    $scope.storeId = "";
    $scope.name = "";
    $scope.description = "";
    $scope.imageUrl = "";
    $scope.priceperUnit = 0;
    $scope.quantity = 0;
    $scope.stores = [];
    $scope.products = [];

    $scope.AddProduct = async function(){
        var data = {
            storeId: $scope.storeId,
            name: $scope.name,
            description: $scope.description,
            imageUrl: $scope.imageUrl,
            pricePerUnit: $scope.pricePerUnit,
            quantity: $scope.quantity
        }

        var response = await App.addProduct(data);
        console.log(response);
        $scope.storeId = "";
        $scope.name = "";
        $scope.description = "";
        $scope.imageUrl = "";
        $scope.priceperUnit = 0;
        $scope.quantity = 0;
        await $scope.RefreshProductsList();
    };

    $scope.RemoveProduct = async function(productId){
        var response = await App.removeProduct(productId);
        console.log(response);
        await $scope.RefreshProductsList();
    };

    $scope.RefreshProductsList = async function(){
        var response = await App.getProductsByStore();
        $scope.products = response;
        console.log(response);
    };

    $scope.Setup = async function(){
        $scope.RefreshProductsList();
    };

    $scope.Setup();
});

app.controller("marketplaceController", function ($scope, $http){
    $scope.RedirectToStore = function(storeId){
        $scope.stores = [];

        $scope.GetAllStores = async function(){
            var response = await App.getAllStores();
            console.log(response);
            $scope.stores = response;
        };
    
        $scope.RedirectToStore = function (store) {
            $location.path("/store/" + store.id);
        };

        $scope.Setup = async function(){
            $scope.GetAllStores();
        };
    
        $scope.Setup();
    }
});

app.controller("storeController", function ($scope, $http){
    $scope.BuyProduct = function(productId){
        $scope.store = {};
        $scope.products = [];

        $scope.Setup = async function(){

        }

        $scope.Setup();
    }
});
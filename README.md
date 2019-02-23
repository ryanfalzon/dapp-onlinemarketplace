# Online Marketplace

# User Stories

**[!VIDEO DEMO AND CODE EXPLANATION HERE!](https://www.youtube.com/watch?v=pxO5hFH9J8E)**

This application has three types of users:

1. Administrator - The creator of the smart contract;
2. Store Manager - Able to create stores and products;
3. Normal User - Able to browse the marketplace;

When the administrator open the web application, he would have access to the administrator functions, which enable him to add, remove and view the current store store managers. Whenever the administrator adds a new address to the manager list, that address would have access to the store manager functions.

When an approved store manager open the web application, it recognizes the address as a store manager and shows them the store manager function tab. Here, the user can do any of the following operations:

- Create a new store;
- Delete a store;
- View receipts for products sold;
- Withdraw store balance into his account;
- Add a new product;
- Remove a product;

Finally, when a normal user visits the application, it won't recognize the address as neither an administartor or even a store manager, and therefore shows the user the marketplace space. Here a list of stores that were created by store managers will be available. Once the user clicks ona store, a list of available products form that store are shown and the user would have the ability to buy a number of the products from that store.

## Setting Up The Environment

Install [Node.js](https://nodejs.org/en/download/current/)

Install [Geth](https://geth.ethereum.org/downloads/)

Install [Python](https://www.python.org/downloads/)

Install [C++ Build Tools](https://www.microsoft.com/en-us/download/details.aspx?id=8279)

Install [Metamask](https://metamask.io/)

In a command line opened as an Administrator, run the following commands one after the other:

```bash
npm install -g ganache-cli
npm install -g truffle
npm install -g production windows-build tools
```

In a command line, opened as an Administrator, in the src directory of the solution, run the following commands:

```bash
npm install web3
npm install solc
```

## Running The Solution

Clone the repository on your machine. Open a command line and type the following command:

```bash
ganache-cli <options>
```

It is important to take note of the list of public addresses and their respective private keys that are displayed in the terminal at the start of execution.

Open another command line, navigate to the route folder of the repository, and run the following command

```bash
truffle migrate
```

Open another command line, navigate to the app/src folder in the repository and run the following command:
```
npm run dev
```

Open metamask chrome extension, click on import account, paste the private key of the first account that was displayed when executing testrpc and click import. This will connect metamask to the first address.

To view the website, naviagte to localhost:8080

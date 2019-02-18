# Online Marketplace

## Setting Up The Environment

Install [Node.js](https://nodejs.org/en/download/current/)

Install [Geth](https://geth.ethereum.org/downloads/)

Install [Python](https://www.python.org/downloads/)

Install [C++ Build Tools](https://www.microsoft.com/en-us/download/details.aspx?id=8279)

Install [Metamask](https://metamask.io/)

In a comman line opened as an Administrator, run the following commands one after the other:

```bash
npm install -g ganache-cli
npm install -g truffle
npm install -g production windows-build tools
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

Open metamask chrome extension, click on import account, past the private key of the first account that was displayed when executing testrpc and click import. This will connect metamask to the first address.

To view the website, naviagte to localhost:8080

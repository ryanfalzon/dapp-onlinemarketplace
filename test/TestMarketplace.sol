pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Marketplace.sol";

contract TestMarketplace{

    // Properties
    address administratorTestAddress = 0x7190d946759c0488d349233579d36845c783f495;
    address managerTestAddress = 0x35530a0b00574a06341f55098dc942e68d277411;

    // Function to test the funcaionality of adding a store manager
    function testAddManager() public{
        Marketplace marketplace = Marketplace(DeployedAddresses.Marketplace());

        bool expected = true;
        marketplace.AddManager(managerTestAddress);
        Assert.equal(
            marketplace.managers(managerTestAddress),
            expected,
            "Manager Was Not Succesfully Added"
        );
    }

    // Function to test the functionality of deleteing a store manager which has previously been added
    function testRemoveManagerNeverAdded() public{
        Marketplace marketplace = Marketplace(DeployedAddresses.Marketplace());

        bool expected = true;
        marketplace.RemoveManager(managerTestAddress);
        Assert.equal(
            marketplace.managers(managerTestAddress),
            expected,
            "Manager Was Not Succesfully Removed"
        );
    }

    // Function to test the functionality of deleteing a store manager which has previously never been added
    function testRemoveManagerNeverAdded() public{
        Marketplace marketplace = Marketplace(DeployedAddresses.Marketplace());

        string expected = "Address Is Not A Manager";
        marketplace.RemoveManager(administratorTestAddress);
        Assert.equal(
            marketplace.managers(administratorTestAddress),
            expected,
            "Manager Was Not Succesfully Added"
        );
    }

    // Function to test the administrator status for a correct address
    function testCheckCorrectAdministrator() public{
        Marketplace marketplace = Marketplace(DeployedAddress.marketplace());

        bool expected = true;
        Assert.equal(
            marketplace.CheckAdministrator(administratorTestAddress),
            expected,
            "Address Is Not An Administrator"
        );
    }

    // Function to test the administrator status for an incorrect address
    function testCheckIncorrectAdministrator() public{
        Marketplace marketplace = Marketplace(DeployedAddresses.marketplace());

        bool expected = false;
        Assert.equal(
            marketplace.CheckAdministrator(managerTestAddress),
            expected,
            "Address Is Actually An Administrator"
        );
    }

    // Function to test the store manager status with a valid address
    function testCheckCorrectManager() public{
        Marketplace marketplace = Marketplace(DeployedAddresses.marketplace());

        bool expected = true;
        Assert.equal(
            marketplace.CheckManager(managerTestAddress),
            expected,
            "Address Is Not A Manager"
        );
    }

    // Function to test the store manager status with an invalid address
    function testCheckIncorrectManager() public{
        Marketplace marketplace = Marketplace(DeployedAddresses.marketplace());

        bool expected = false;
        Assert.equal(
            marketplace.CheckManager(administratorTestAddress),
            expected,
            "Address Is Actually A manager"
        );
    }

    // Function to test the functionality to get all managers
    function testGetAllManagers() public{
        Marketplace marketplace = Marketplace(DeployedAddresses.Marketplace());

        address[] expected = [managerTestAddress];
        marketplace.AddManager(managerTestAddress);
        Assert.equal(
            marketplace.GetAllManagers,
            expected,
            "Not All Managers Were Successfully Returned"
        );
    }
}
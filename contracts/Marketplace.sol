pragma solidity ^0.5.0;

contract Marketplace{

    // Properties
    address[] private allManagers;
    mapping(address => bool) public managers;

    // Contract events
    address private administrator;
    event ManagerAdded(address addedAddress);
    event ManagerRemoved(address removedAddress);

    // Constructor - Sets the person who initiates the Marketplace contract as an administrator
    constructor() public {
        administrator = msg.sender;
    }

    // Function to check if the address passed is an administrator
    function CheckAdministrator(address addressToCheck) public view returns(bool){
        return (administrator == addressToCheck);
    }

    // Function to add a new manager
    function AddManager(address manager) public AuthenticateMessageSender {
        // Make sure address passed is not already a manager
        require(managers[manager] == false, "Address is already a manager");

        managers[manager] = true;
        allManagers.push(manager);
        emit ManagerAdded(manager);
    }

    // Function to remove a manager
    function RemoveManager(address manager) public AuthenticateMessageSender {
        // Make sure address passed is actually a manager
        require(managers[manager] == true, "Address is not a manager");

        managers[manager] = false;

        // Delete managers from array of all managers
        uint managerCount = allManagers.length;
        for(uint i = 0; i < managerCount; i++){
            if(allManagers[i] == manager){
                delete allManagers[i];
                break;
            }
        }

        emit ManagerRemoved(manager);
    }

    // Function to get all store managers
    function GetAllManagers() public view returns(address[] memory){
        return allManagers;
    }

    // Function to check if the address passed is a manager
    function CheckManager(address manager) public view returns(bool){
        return managers[manager];
    }

    // Function to check of message sender is a manager
    modifier AuthenticateMessageSender(){
        require((administrator == msg.sender), "Only Administrators Are Able To Run This Function");
        _;
    }
}
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
    function CheckAdministrator(address addressToCheck) view public returns(bool){
        return (administrator == addressToCheck);
    }

    // Function to add a new manager
    function AddManager(address manager) AuthenticateMessageSender public {
        managers[manager] = true;
        allManagers.push(manager);
        emit ManagerAdded(manager);
    }

    // Function to remove a manager
    function RemoveManager(address manager) AuthenticateMessageSender public {
        require(managers[manager] == true);
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
    function GetAllManagers() view public returns(address[] memory){
        return allManagers;
    }

    // Function to check if the address passed is a manager
    function CheckManager(address manager) view public returns(bool){
        return managers[manager];
    }

    // Function to check of message sender is a manager
    modifier AuthenticateMessageSender(){
        require((administrator == msg.sender), "Invalid Message Sender");
        _;
    }
}
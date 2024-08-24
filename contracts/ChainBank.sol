// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ChainBank {

    struct Account {
        string name;
        uint balance;
        address accountNumber;
    }

    mapping(address => Account) public accounts;
    address public bankOwner;

    constructor() {
        bankOwner = msg.sender;
    }

    event CreateAccount(string name, uint balance, address accountNumber);
    event ShowBalance(string message, uint balance);

    function createAccount(string memory _name) public {
        // Ensure the account does not already exist
        require(accounts[msg.sender].accountNumber == address(0), "Account already exists");

        // Create a new Account struct and assign it to the caller's address
        accounts[msg.sender] = Account({
            name: _name,
            balance: 0,
            accountNumber: msg.sender
        });

        // Emit the event
        emit CreateAccount(_name, accounts[msg.sender].balance, accounts[msg.sender].accountNumber);
    }

    event TransactionEvent(address from, address to, uint value);

    function deposit() public payable {
        accounts[msg.sender].balance += msg.value;
    }

    function getBalance() public returns (uint) {
        emit ShowBalance("Your account balance is", accounts[msg.sender].balance);
        return accounts[msg.sender].balance;
    }

    function withdraw(uint256 _amount) public {
        require (accounts[msg.sender].balance >= _amount, "Insuffient balance");
        
        accounts[msg.sender].balance -= _amount;

        payable(accounts[msg.sender].accountNumber).transfer(_amount);
    }

    function transfer(address recipient, uint256 amount) public {
        require(accounts[msg.sender].balance >= amount, "Insufficient balance");
        require(recipient != address(0), "Invalid address");

        accounts[msg.sender].balance -= amount;
        accounts[recipient].balance += amount;

        emit TransactionEvent(msg.sender, recipient, amount);
    }


}

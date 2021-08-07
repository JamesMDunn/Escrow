//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";


contract Escrow {
  struct Agreement {
    address depositor;
    address withdrawer;
    uint256 value;
    uint timelock;
  }
  
  uint public escrowId; 
  
  mapping(uint => Agreement) public agreements;

  constructor() {
    console.log("Deploying a Escrow Smart Contract!");
  }

  function register(address _to) external payable {
    require(_to != msg.sender, "Cannot register the same address");
    require(_to != address(this), "Cannot register this contracts address");
    console.log("Got herex2", address(this));
    escrowId++;
    agreements[escrowId] = Agreement(msg.sender, _to, msg.value, 100);
  }
}

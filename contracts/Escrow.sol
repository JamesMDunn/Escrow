//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Escrow {
  struct Agreement {
    address payable depositor;
    address payable withdrawer;
    uint256 value;
    uint payBlockInterval;
    uint payRate;
    uint lastActivityBlock;
    uint expiredLock;
    uint paidOut;
  }
  
  uint public escrowId; 
  
  mapping(uint => Agreement) public agreements;

  constructor() {
    console.log("Deploying a Escrow Smart Contract!");
  }

  function register(address payable _to, uint _payBlockInterval) external payable returns(uint){
    require(_to != msg.sender, "Cannot register the same address");
    require(_to != address(this), "Cannot register this contracts address");
    console.log("Got herex2", address(this));
    escrowId++;
    address payable _depositer = payable(msg.sender);
    uint256 _amount = msg.value;
    uint _payRate = _amount / _payBlockInterval;
    uint _lastActivityBlock = block.number;
    uint _expiredLock = block.number + 100;

    agreements[escrowId] = Agreement(
      _depositer, 
      _to, 
      _amount, 
      _payBlockInterval, 
      _payRate, 
      _lastActivityBlock, 
      _expiredLock,
      0
    );
    return escrowId;
  }

  function withdraw(uint _id) external payable {
    require(agreements[_id].withdrawer == msg.sender);
    require(block.number > agreements[_id].payBlockInterval + agreements[_id].lastActivityBlock,
        "Its not payblock time yet");
    Agreement storage _agreement = agreements[escrowId];
    console.log("Got herex2", _agreement.payRate);
    _agreement.lastActivityBlock = block.number;
    if (_agreement.payRate > _agreement.value) {
        console.log("testing?", _agreement.payRate, _agreement.value); 
        _agreement.withdrawer.call{value: _agreement.value};
        _agreement.paidOut += _agreement.value;
        _agreement.value = 0;
        return;
    }
    _agreement.value -= _agreement.payRate;
    _agreement.withdrawer.call{value: _agreement.payRate};
    _agreement.paidOut += _agreement.payRate;
  }
}

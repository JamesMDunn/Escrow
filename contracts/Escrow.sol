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
    bool isExpired;
    uint paidOut;
  }
  
  uint public escrowId; 
  
  mapping(uint => Agreement) public agreements;
  event Registered(address _depositer, address _withdrawer, uint256 _value);


  constructor() {
    console.log("Deploying a Escrow Smart Contract!");
  }

  function register(address payable _to, uint _payBlockInterval) external payable returns(uint){
    require(_to != msg.sender, "Cannot register the same address");
    require(_to != address(this), "Cannot register this contracts address");
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
    emit Registered(_depositer, _to, _amount);
    return escrowId;
  }

  function withdraw(uint _id) external payable {
    require(agreements[_id].withdrawer == msg.sender, "you are not the withdrawer");
    require(block.number > agreements[_id].payBlockInterval + agreements[_id].lastActivityBlock,
        "Its not payblock time yet");
    require(agreements[_id].isExpired == false);
    Agreement storage _agreement = agreements[escrowId];
    _agreement.lastActivityBlock = block.number;
    if (_agreement.payRate > _agreement.value) { 
        _agreement.withdrawer.call{value: _agreement.value};
        _agreement.paidOut += _agreement.value;
        _agreement.value = 0;
        return;
    }
    _agreement.value -= _agreement.payRate;
    _agreement.withdrawer.call{value: _agreement.payRate};
    _agreement.paidOut += _agreement.payRate;
  }

  function depositor_withdraw(uint id) external payable {
    require(agreements[_id].depositor == msg.sender);
    require(agreements[_id].expiredLock <= block.number);
    require(agreements[_id].isExpired == false);
    Agreement storage _agreement = agreements[_id];

    _agreement.depositor.call{value: _agreement.value };
    _agreement.value = 0;
    _agreement.isExpired = true;
  }
}

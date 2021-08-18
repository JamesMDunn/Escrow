//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Escrow {
    struct Agreement {
        address depositor;
        address withdrawer;
        uint256 value;
        uint256 payBlockInterval;
        uint256 payRate;
        uint256 lastActivityBlock;
        uint256 expiredLock;
        bool isExpired;
        uint256 paidOut;
    }

    uint256 public escrowId;
    mapping(uint256 => Agreement) public agreements;
    event Registered(uint256 _id, address _depositer, address _withdrawer);

    constructor() {
        console.log("Deploying a Escrow Smart Contract!");
    }

    function raiseExpiration(uint256 _payBlockInterval)
        private
        view
        returns (uint256)
    {
        return block.number + 100 + _payBlockInterval;
    }

    function register(address _to, uint256 _payBlockInterval)
        public
        payable
        returns (bool)
    {
        require(_to != msg.sender, "Cannot register the same address");
        require(_to != address(this), "Cannot register this contracts address");
        require(msg.value > 0);
        escrowId++;
        address _depositer = msg.sender;
        uint256 _amount = msg.value;
        uint256 _payRate = _amount / _payBlockInterval;
        uint256 _lastActivityBlock = block.number;
        uint256 _expiredLock = raiseExpiration(_payBlockInterval);

        agreements[escrowId] = Agreement(
            _depositer,
            _to,
            _amount,
            _payBlockInterval,
            _payRate,
            _lastActivityBlock,
            _expiredLock,
            false,
            0
        );
        emit Registered(escrowId, _depositer, _to);
        console.log("after emit");
        return true;
    }

    function withdraw(uint256 _id) public {
        require(
            agreements[_id].withdrawer == msg.sender,
            "you are not the withdrawer"
        );
        require(
            block.number >
                agreements[_id].payBlockInterval +
                    agreements[_id].lastActivityBlock,
            "Its not payblock time yet"
        );
        require(agreements[_id].isExpired == false);
        require(agreements[_id].value > 0);

        Agreement storage _agreement = agreements[escrowId];
        _agreement.lastActivityBlock = block.number;
        if (_agreement.payRate > _agreement.value) {
            _agreement.withdrawer.call{value: _agreement.value};
            _agreement.paidOut += _agreement.value;
            _agreement.value = 0;
            return;
        }
        _agreement.value -= _agreement.payRate;
        payable(msg.sender).transfer(_agreement.payRate);
        _agreement.paidOut += _agreement.payRate;
        _agreement.expiredLock = raiseExpiration(_agreement.payBlockInterval);
    }

    function depositorWithdraw(uint256 _id) public {
        require(
            agreements[_id].depositor == msg.sender,
            "your are not the depositer of this agreement"
        );
        require(
            agreements[_id].isExpired == false,
            "this agreement has expired"
        );
        Agreement storage _agreement = agreements[_id];
        payable(msg.sender).transfer(_agreement.value);
        _agreement.value = 0;
        _agreement.isExpired = true;
    }

    function increaseAgreementPay(uint256 _id) public payable {
        require(agreements[_id].depositor == msg.sender);
        require(agreements[_id].isExpired == false);
        Agreement storage _agreement = agreements[_id];
        _agreement.value += msg.value;
    }

    function extendAgreement(uint256 _id, uint256 _num) public {
        require(agreements[_id].depositor == msg.sender);
        require(agreements[_id].isExpired == false);
        Agreement storage _agreement = agreements[_id];
        _agreement.expiredLock += _num;
    }
}

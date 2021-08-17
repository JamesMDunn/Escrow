//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Escrow {
    event Registered(uint256 _id, address _depositer, address _withdrawer);

    struct Agreement {
        address payable depositor;
        address payable withdrawer;
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

    constructor() {
        console.log("Deploying a Escrow Smart Contract!");
    }

    function register(address payable _to, uint256 _payBlockInterval)
        external
        payable
        returns (bool)
    {
        require(_to != msg.sender, "Cannot register the same address");
        require(_to != address(this), "Cannot register this contracts address");
        escrowId++;
        address payable _depositer = payable(msg.sender);
        uint256 _amount = msg.value;
        uint256 _payRate = _amount / _payBlockInterval;
        uint256 _lastActivityBlock = block.number;
        uint256 _expiredLock = block.number + 100;

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

    function withdraw(uint256 _id) external {
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

    function depositorWithdraw(uint256 _id) external {
        require(
            agreements[_id].depositor == msg.sender,
            "your are not the depositer of this agreement"
        );
        require(
            agreements[_id].isExpired == false,
            "this agreement has expired"
        );
        Agreement storage _agreement = agreements[_id];

        _agreement.depositor.call{value: _agreement.value};
        _agreement.value = 0;
        _agreement.isExpired = true;
    }

    function increaseAgreementPay(uint256 _id) external payable {
        require(agreements[_id].depositor == msg.sender);
        require(agreements[_id].isExpired == false);
        Agreement storage _agreement = agreements[_id];
        _agreement.value += msg.value;
    }

    function extendAgreement(uint256 _id, uint256 _num) external {
        require(agreements[_id].depositor == msg.sender);
        require(agreements[_id].isExpired == false);
        Agreement storage _agreement = agreements[_id];
        _agreement.expiredLock += _num;
    }
}

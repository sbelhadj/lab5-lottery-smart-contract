// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Lottery {
    address public manager;
    address[] public players;

    event PlayerJoined(address indexed player);
    event WinnerSelected(address indexed winner, uint256 amount);

    modifier onlyManager() {
        require(msg.sender == manager, "Only manager can call this function");
        _;
    }

    constructor() {
        manager = msg.sender;
    }

    function joinLottery() public payable {
        require(msg.value == 0.01 ether, "Must send exactly 0.01 ETH to join");
        players.push(msg.sender);
        emit PlayerJoined(msg.sender);
    }

    function getPlayers() public view returns (address[] memory) {
        return players;
    }

    function pickWinner() public onlyManager {
        require(players.length > 0, "No players have entered the lottery");

        uint index = random() % players.length;
        address winner = players[index];
        uint256 prize = address(this).balance;

        payable(winner).transfer(prize);
        emit WinnerSelected(winner, prize);

        delete players;
    }

    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, players)));
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Lottery {
    address public manager;
    address[] public players;

    event PlayerJoined(address indexed player);
    event WinnerSelected(address indexed winner, uint256 amount);

    modifier onlyManager() {
        require(msg.sender == manager, "Seul le manager peut appeler cette fonction");
        _;
    }

    constructor() {
        manager = msg.sender;
    }

    function joinLottery() public payable {
        require(msg.value == 0.01 ether, "Vous devez envoyer exactement 0.01 ETH pour participer");
        players.push(msg.sender);
        emit PlayerJoined(msg.sender);
    }

    function getPlayers() public view returns (address[] memory) {
        return players;
    }

    function pickWinner() public onlyManager {
        require(players.length > 0, "Aucun joueur inscrit");
        uint index = random() % players.length;
        address winner = players[index];

        payable(winner).transfer(address(this).balance);
        emit WinnerSelected(winner, address(this).balance);

        players = new address  }

    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.timestamp, players)));
    }
}

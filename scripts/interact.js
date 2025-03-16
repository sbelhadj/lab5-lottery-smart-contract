require('dotenv').config();
const Web3 = require('web3');

const web3 = new Web3("https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID");
const contractABI = [ /* Copier ABI de Remix */ ];
const contractAddress = "YOUR_CONTRACT_ADDRESS";

const contract = new web3.eth.Contract(contractABI, contractAddress);

async function joinLottery() {
    const accounts = await web3.eth.getAccounts();
    await contract.methods.joinLottery().send({ from: accounts[0], value: web3.utils.toWei("0.01", "ether") });
    console.log("Vous avez rejoint la lottery !");
}

async function pickWinner() {
    const accounts = await web3.eth.getAccounts();
    await contract.methods.pickWinner().send({ from: accounts[0] });
    console.log("Le gagnant a été sélectionné !");
}

joinLottery();

require('dotenv').config();
const Web3 = require('web3');

const web3 = new Web3(`https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`);
const contractABI = [ /* Copier ABI de Remix après compilation */ ];
const contractAddress = process.env.CONTRACT_ADDRESS;

const contract = new web3.eth.Contract(contractABI, contractAddress);
const account = web3.eth.accounts.privateKeyToAccount(process.env.ACCOUNT_PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);

async function joinLottery() {
    const tx = contract.methods.joinLottery();
    const gas = await tx.estimateGas({ from: account.address, value: web3.utils.toWei("0.01", "ether") });
    const txData = {
        from: account.address,
        to: contractAddress,
        gas,
        value: web3.utils.toWei("0.01", "ether"),
        data: tx.encodeABI()
    };

    const signedTx = await web3.eth.accounts.signTransaction(txData, account.privateKey);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log("Transaction hash:", receipt.transactionHash);
}

async function pickWinner() {
    const tx = contract.methods.pickWinner();
    const gas = await tx.estimateGas({ from: account.address });
    const txData = {
        from: account.address,
        to: contractAddress,
        gas,
        data: tx.encodeABI()
    };

    const signedTx = await web3.eth.accounts.signTransaction(txData, account.privateKey);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log("Le gagnant a été sélectionné !");
}

joinLottery();

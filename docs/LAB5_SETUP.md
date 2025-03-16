# 🚀 **Lab 5 : Développement et Déploiement d’un Smart Contract de Lottery**  

## 🎯 **Objectifs du Lab**  
Dans ce lab, nous allons :  
✅ Écrire un **Smart Contract Solidity** pour un jeu de **Lottery**  
✅ Compiler et tester le contrat avec **Remix IDE**  
✅ Déployer sur le **Testnet Sepolia** via **Metamask**  
✅ Interagir avec le contrat via **Web3.js**  

---

## 📂 **1️⃣ Prérequis**  

Avant de commencer, assurez-vous d’avoir les outils suivants installés :  

### 🔹 **Outils requis**  
| Outil | Utilité | Lien |
|-------|---------|------|
| **Metamask** | Gestion des comptes Ethereum | [🔗 Installer](https://metamask.io/) |
| **Remix IDE** | Environnement pour coder en Solidity | [🔗 Remix](https://remix.ethereum.org/) |
| **Infura** | Fournisseur de nœuds Ethereum | [🔗 Inscription](https://infura.io/) |
| **Faucet Sepolia** | Obtenir des ETH pour le testnet | [🔗 Faucet](https://www.alchemy.com/faucets/ethereum-sepolia) |

### 🔹 **Installer Node.js et Web3.js**  
Ouvrez un terminal et exécutez :  
```bash
sudo apt update && sudo apt install -y nodejs npm
npm install -g web3 dotenv
```

## 🔹 **Configurer Metamask avec Sepolia**
1️⃣ Ouvrir Metamask → Aller dans Paramètres > Réseaux > Ajouter un Réseau

2️⃣ Entrer les informations suivantes :

  Nom : Sepolia
  RPC URL : https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
  Chain ID : 11155111
  Explorateur : https://sepolia.etherscan.io/
  
3️⃣ Ajouter des ETH Sepolia via un Faucet :
🔗 Alchemy Sepolia Faucet

## 📜 **Écrire le Smart Contract**
1️⃣ Ouvrir Remix IDE
🔗 Aller sur Remix Ethereum
Créer un nouveau fichier Lottery.sol

2️⃣ Copier ce code dans Remix IDE :

```solidity
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
        require(msg.value == 0.01 ether, "Envoyez 0.01 ETH pour participer");
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

        players = new address ;
    }

    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.timestamp, players)));
    }
}
```

## 🔨 **Compiler le Smart Contract**
1️⃣ Aller dans l’onglet "Solidity Compiler" sur Remix
2️⃣ Sélectionner la version 0.8.20
3️⃣ Cliquer sur Compile Lottery.sol ✅

✅ Si la compilation réussit, vous êtes prêt à déployer le contrat !

## **Déployer le Contrat sur Sepolia**
1️⃣ Aller dans l’onglet Deploy & Run Transactions
2️⃣ Sélectionner Injected Web3 (Connecté à Metamask)
3️⃣ Vérifier que Sepolia Testnet est bien sélectionné
4️⃣ Cliquer sur Deploy et Confirmer la transaction dans Metamask

📌 Vérifier le contrat sur Sepolia Explorer :
🔗 Sepolia Etherscan

## 🖥️ **Interagir avec le Smart Contract via Web3.js**
1️⃣ Installer les dépendances dans votre projet local

```bash
npm install web3 dotenv
```

2️⃣ Modifier .env avec vos clés API :

```bash
INFURA_PROJECT_ID=your_infura_project_id
CONTRACT_ADDRESS=your_deployed_contract_address
ACCOUNT_PRIVATE_KEY=your_metamask_private_key
```

3️⃣ Créer un fichier scripts/interact.js :

```javascript
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
```

## ✅ **Test et Vérification**
✔️ Joindre la Lottery

```bash
node scripts/interact.js
```

✔️ Sélectionner un Gagnant

```bash
node scripts/interact.js pickWinner
```

📌 Vérifier l'historique des transactions sur Sepolia Etherscan

## 🎯 **Félicitations !**
Vous avez écrit, déployé et interagi avec un Smart Contract de Lottery sur Ethereum !
🔗 N’hésitez pas à modifier le contrat pour ajouter plus de fonctionnalités !

## 📚 **Ressources Supplémentaires**
📖 Solidity Docs
📖 Ethereum Smart Contract Security Best Practices
🛠️ Web3.js Documentation

Bravo ! Vous avez complété ce lab avec succès !

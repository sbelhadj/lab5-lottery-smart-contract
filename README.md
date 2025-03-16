# 🚀 Lab 5 : Écrire et Déployer un Smart Contract Solidity – Jeu de Lottery  

🔹 Thème du Lab : Développement d’un Smart Contract de Lottery avec Solidity, Remix IDE et Sepolia Testnet.
🔹 Format : Ateliers pratiques avec Remix, Metamask et Sepolia Faucet.
🔹 Technologies utilisées : Solidity, Remix IDE, Web3.js, Metamask, Sepolia Testnet.

## 🎯 Objectif  
Ce lab vous guide à travers l'écriture, la compilation et le déploiement d'un **Smart Contract de Lottery** sur **Remix IDE** et le testnet **Sepolia**.  

✅ **Créer un jeu de Lottery sur Ethereum**  
✅ **Utiliser les fonctions Solidity pour gérer des joueurs et tirer un gagnant**  
✅ **Déployer sur le Testnet Sepolia avec Metamask**  
✅ **Interagir avec le contrat via Web3.js**  

---

## 📂 Structure du repo  

```plaintext
📦 lab5-lottery-smart-contract
 ├── 📂 contracts               # Dossier contenant les Smart Contracts
 │    ├── Lottery.sol           # Smart Contract du jeu de Lottery
 │
 ├── 📂 docs                     # Documentation et guides
 │    ├── LAB5_SETUP.md          # Instructions détaillées pour le Lab 5
 │    ├── DEPLOYMENT_GUIDE.md    # Guide de déploiement sur Sepolia
 │
 ├── 📂 scripts                  # Scripts pour interaction avec le contrat
 │    ├── interact.js            # Script pour interagir avec le contrat via Web3.js
 │
 ├── 📜 .gitignore               # Fichiers à ignorer dans le repo
 ├── 📜 README.md                # Présentation du Lab 5
 ├── 📜 package.json             # Dépendances du projet (Web3.js)
 ├── 📜 LICENSE                  # Licence du projet
```

## Ouvrir le fichier contracts/Lottery.sol sur Remix IDE
🔗 Remix IDE : https://remix.ethereum.org/

## Déployer sur Sepolia

Configurer Metamask sur Sepolia
Obtenir des ETH Sepolia sur un Faucet
Suivre le guide docs/DEPLOYMENT_GUIDE.md

## Interagir avec le contrat via Web3.js

```bash
node scripts/interact.js
```

✅ Félicitations ! Vous avez déployé et interagi avec votre premier Smart Contract de Lottery !

import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Replace with your deployed contract address
const contractAddress = "0x08Aa1C907ddc0c3F0152d2EaCb07e0A752FAaBD6";

const contractABI = [
  {
    "anonymous": false,
    "inputs": [{ "indexed": true, "internalType": "address", "name": "player", "type": "address" }],
    "name": "PlayerJoined",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "winner", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "WinnerSelected",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "joinLottery",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "pickWinner",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getPlayers",
    "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "manager",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  }
];

function App() {
  const [account, setAccount] = useState("");
  const [players, setPlayers] = useState([]);
  const [contract, setContract] = useState(null);
  const [isManager, setIsManager] = useState(false);

  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      } else {
        setAccount("");
        toast.error("Please connect to MetaMask.");
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error("MetaMask is not installed. Please install MetaMask and try again.");
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const lottery = new ethers.Contract(contractAddress, contractABI, signer);
      setContract(lottery);

      const manager = await lottery.manager();
      setIsManager(manager.toLowerCase() === accounts[0].toLowerCase());

      const playersList = await lottery.getPlayers();
      setPlayers(playersList);

      lottery.on("PlayerJoined", (player) => {
        toast.success(`🎉 ${player} joined the lottery`);
        setPlayers((prev) => [...prev, player]);
      });

      lottery.on("WinnerSelected", (winner, amount) => {
        toast.info(`🏆 Winner: ${winner}, Prize: ${ethers.formatEther(amount)} ETH`);
        setPlayers([]);
      });
    } catch (err) {
      console.error("Error connecting wallet:", err);
      toast.error("Error connecting wallet: " + err.message);
    }
  };

  const joinLottery = async () => {
    if (!contract) {
      toast.error("Contract is not initialized. Please connect your wallet.");
      return;
    }

    try {
      const tx = await contract.joinLottery({ value: ethers.parseEther("0.01") });
      await tx.wait();
      toast.success("Successfully joined the lottery!");
    } catch (err) {
      console.error(err);
      toast.error("Error joining lottery: " + err.message);
    }
  };

  const pickWinner = async () => {
    if (!contract) {
      toast.error("Contract is not initialized. Please connect your wallet.");
      return;
    }

    try {
      const tx = await contract.pickWinner();
      await tx.wait();
      toast.success("Winner has been picked!");
    } catch (err) {
      console.error(err);
      toast.error("Error picking winner: " + err.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <ToastContainer />
      <h1>🎰 Lottery DApp</h1>
      {!account ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <>
          <p>Connected wallet: {account}</p>
          <button onClick={joinLottery}>Join Lottery (0.01 ETH)</button>

          {isManager && (
            <>
              <h3>Manager Controls</h3>
              <button onClick={pickWinner}>Pick Winner</button>
            </>
          )}

          <h3>Players:</h3>
          <ul>
            {players.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Web3 from 'web3';
import RegionDeploymentContract from './contracts/RegionDeployment.json';
import ShardVotingContract from './contracts/ShardVoting.json';
import MainAggregatorContract from './contracts/MainAggregator.json';
import Navbar from './components/Navbar';
import Home from './components/Home';
import RegionSelection from './components/RegionSelection';
import VotingPage from './components/VotingPage';
import Results from './components/Results';
import AdminPanel from './components/AdminPanel';
import './App.css';

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [regionDeployment, setRegionDeployment] = useState(null);
  const [shards, setShards] = useState([]);
  const [aggregator, setAggregator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userShard, setUserShard] = useState(null);

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        // Modern dapp browsers
        if (window.ethereum) {
          const web3Instance = new Web3(window.ethereum);
          try {
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            setWeb3(web3Instance);

            // Get accounts
            const accounts = await web3Instance.eth.getAccounts();
            setAccounts(accounts);

            // Load contract instances
            await loadContracts(web3Instance);
          } catch (error) {
            setError('User denied account access');
          }
        }
        // Legacy dapp browsers
        else if (window.web3) {
          const web3Instance = new Web3(window.web3.currentProvider);
          setWeb3(web3Instance);

          // Get accounts
          const accounts = await web3Instance.eth.getAccounts();
          setAccounts(accounts);

          // Load contract instances
          await loadContracts(web3Instance);
        }
        // Non-dapp browsers
        else {
          setError('Non-Ethereum browser detected. You should consider trying MetaMask!');
        }
      } catch (error) {
        console.error("Error initializing web3:", error);
        setError('Failed to load web3, accounts, or contract. Check console for details.');
      } finally {
        setLoading(false);
      }
    };

    initWeb3();
  }, []);

  const loadContracts = async (web3Instance) => {
    try {
      // Get network ID
      const networkId = await web3Instance.eth.net.getId();

      // Get RegionDeployment contract instance
      const regionDeploymentData = RegionDeploymentContract.networks[networkId];
      if (regionDeploymentData) {
        const regionDeploymentInstance = new web3Instance.eth.Contract(
          RegionDeploymentContract.abi,
          regionDeploymentData.address
        );
        setRegionDeployment(regionDeploymentInstance);

        // Get MainAggregator address from RegionDeployment
        const aggregatorAddress = await regionDeploymentInstance.methods.aggregator().call();
        const aggregatorInstance = new web3Instance.eth.Contract(
          MainAggregatorContract.abi,
          aggregatorAddress
        );
        setAggregator(aggregatorInstance);

        // Load all shard contracts
        const shardInstances = [];
        let i = 0;
        let hasMoreShards = true;

        while (hasMoreShards) {
          try {
            const shardAddress = await regionDeploymentInstance.methods.shards(i).call();
            const shardInstance = new web3Instance.eth.Contract(
              ShardVotingContract.abi,
              shardAddress
            );
            shardInstances.push({
              id: i,
              instance: shardInstance,
              address: shardAddress
            });
            i++;
          } catch (error) {
            hasMoreShards = false;
          }
        }

        setShards(shardInstances);

        // Find the shard where the user is registered
        if (accounts[0]) {
          for (let i = 0; i < shardInstances.length; i++) {
            const shard = shardInstances[i];
            const voter = await shard.instance.methods.voters(accounts[0]).call();
            if (voter.isRegistered) {
              setUserShard(i);
              break;
            }
          }
        }
      } else {
        setError('RegionDeployment contract not deployed to detected network.');
      }
    } catch (error) {
      console.error("Error loading contracts:", error);
      setError('Failed to load contracts. Check console for details.');
    }
  };

  if (loading) {
    return <div className="loading">Loading Web3, accounts, and contracts...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <Router>
      <div className="App">
        <Navbar account={accounts[0]} />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/regions" element={<RegionSelection shards={shards} userShard={userShard} />} />
            <Route path="/vote/:regionId" element={<VotingPage web3={web3} account={accounts[0]} shards={shards} />} />
            <Route path="/results" element={<Results web3={web3} shards={shards} aggregator={aggregator} />} />
            <Route path="/admin" element={<AdminPanel web3={web3} account={accounts[0]} shards={shards} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
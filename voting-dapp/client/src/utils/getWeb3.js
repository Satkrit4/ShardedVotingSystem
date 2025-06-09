// // import Web3 from "web3";

// // const getWeb3 = () =>
// //   new Promise((resolve, reject) => {
// //     // Wait for loading completion to avoid race conditions with web3 injection timing.
// //     window.addEventListener("load", async () => {
// //       // Modern dapp browsers...
// //       if (window.ethereum) {
// //         const web3 = new Web3(window.ethereum);
// //         try {
// //           // Request account access if needed
// //           await window.ethereum.enable();
// //           // Accounts now exposed
// //           resolve(web3);
// //         } catch (error) {
// //           reject(error);
// //         }
// //       }
// //       // Legacy dapp browsers...
// //       else if (window.web3) {
// //         // Use Mist/MetaMask's provider.
// //         const web3 = window.web3;
// //         console.log("Injected web3 detected.");
// //         resolve(web3);
// //       }
// //       // Fallback to localhost; use dev console port by default...
// //       else {
// //         const provider = new Web3.providers.HttpProvider(
// //           "http://127.0.0.1:7545"
// //         );
// //         const web3 = new Web3(provider);
// //         console.log("No web3 instance injected, using Local web3.");
// //         resolve(web3);
// //       }
// //     });
// //   });

// // export default getWeb3;
// import Web3 from "web3";
// import ShardVotingABI from "../contracts/ShardVoting.json";
// import MainAggregatorABI from "../contracts/MainAggregator.json";
// import ElectionABI from "../contracts/Election.json";


// const getWeb3 = () =>
//   new Promise((resolve, reject) => {
//     window.addEventListener("load", async () => {
//       try {
//         const web3 = new Web3(window.ethereum);
//         await window.ethereum.request({ method: "eth_requestAccounts" });

//         const accounts = await web3.eth.getAccounts();
//         const networkId = await web3.eth.net.getId();

//         // Load ShardVoting Contracts
//         const shardContracts = [];
//         const shardAddresses = [
//           "0x8A3F9b20c45342D4A741d0DA24d80F0da8600739",
//           "0xEc9a19728f00f3ebaD2aabB3d525282c94ffa42A",
//           "0x61D91D4e0ceF6cD080448c16175A9efd63DFd8e6"
//         ];
//         for (const address of shardAddresses) {
//           const contract = new web3.eth.Contract(ShardVotingABI.abi, address);
//           shardContracts.push(contract);
//         }

//         // Load Aggregator Contract
//         const aggregatorAddress = "0x0813Ec5B34940F0aF33957F00185D956CDB6FbFA"; 
//         const aggregatorContract = new web3.eth.Contract(
//           MainAggregatorABI.abi,
//           aggregatorAddress
//         );

//         const electionAddress = "0xfb0176EE83fB3A72c7A68d156De6D89A43532285"; 
//         const electionContract = new web3.eth.Contract(
//           ElectionABI.abi,
//           electionAddress
//         );

//         resolve({ web3, accounts, shardContracts, aggregatorContract, electionContract });
//       } catch (error) {
//         reject(error);
//       }
//     });
//   });

// export default getWeb3;
import Web3 from "web3";
import RegionDeploymentContract from "../contracts/RegionDeployment.json";
import ShardVotingContract from "../contracts/ShardVoting.json";
import MainAggregatorContract from "../contracts/MainAggregator.json";

const getWeb3 = async () => {
  let web3;
  let accounts;
  let regionDeployment;
  let shardContracts = [];
  let aggregator;

  try {
    // Modern dapp browsers
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" });
      console.log("Connected to modern Ethereum provider");
    } 
    // Legacy dapp browsers
    else if (window.web3) {
      web3 = new Web3(window.web3.currentProvider);
      console.log("Connected to legacy web3 provider");
    } 
    // Fallback to local provider
    else {
      console.log("No web3 instance detected, using local provider");
      const provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
      web3 = new Web3(provider);
    }

    // Get user accounts
    accounts = await web3.eth.getAccounts();
    console.log("Connected account:", accounts[0]);

    // Get network ID
    const networkId = await web3.eth.net.getId();
    console.log("Network ID:", networkId);

    // Get RegionDeployment contract instance
    const regionDeploymentData = RegionDeploymentContract.networks[networkId];
    if (!regionDeploymentData) {
      throw new Error("RegionDeployment contract not deployed to detected network");
    }
    
    regionDeployment = new web3.eth.Contract(
      RegionDeploymentContract.abi,
      regionDeploymentData.address
    );
    console.log("RegionDeployment contract loaded at:", regionDeploymentData.address);

    // Get MainAggregator address from RegionDeployment
    const aggregatorAddress = await regionDeployment.methods.aggregator().call();
    aggregator = new web3.eth.Contract(
      MainAggregatorContract.abi,
      aggregatorAddress
    );
    console.log("MainAggregator contract loaded at:", aggregatorAddress);

    // Load all shard contracts
    let i = 0;
    let hasMoreShards = true;
    
    while (hasMoreShards) {
      try {
        const shardAddress = await regionDeployment.methods.shards(i).call();
        const shardContract = new web3.eth.Contract(
          ShardVotingContract.abi,
          shardAddress
        );
        shardContracts.push({
          id: i,
          instance: shardContract,
          address: shardAddress
        });
        console.log(`Shard ${i} loaded at:`, shardAddress);
        i++;
      } catch (error) {
        console.log(`Loaded ${i} shards total`);
        hasMoreShards = false;
      }
    }

    return { web3, accounts, regionDeployment, shardContracts, aggregator };
  } catch (error) {
    console.error("Error in getWeb3:", error);
    throw error;
  }
};

export default getWeb3;
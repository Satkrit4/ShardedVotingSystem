// // //updated
// // const Voting = artifacts.require("Election");
// // const ShardVoting = artifacts.require("ShardVoting");
// // const MainAggregator = artifacts.require("MainAggregator");

// // module.exports = async function (deployer, network, accounts) {
// //     const regions = ["Region A", "Region B", "Region C"]; // Define voting regions
// //     let shardAddresses = [];

// //     // Deploy ShardVoting contracts for each region
// //     for (let i = 0; i < regions.length; i++) {
// //         await deployer.deploy(ShardVoting, ["Alice", "Bob", "Charlie"]);
// //         let shardInstance = await ShardVoting.deployed();
// //         shardAddresses.push(shardInstance.address);
// //     }

// //     // Deploy MainAggregator with the addresses of all shard contracts
// //     await deployer.deploy(MainAggregator, shardAddresses);

// //     // Deploy a standalone Voting contract (optional for general elections)
// //     await deployer.deploy(Voting, ["Alice", "Bob", "Charlie"]);
// // };
// const ShardVoting = artifacts.require("ShardVoting");
// const MainAggregator = artifacts.require("MainAggregator");
// const RegionDeployment = artifacts.require("RegionDeployment");

// module.exports = async function(deployer, network, accounts) {
//   // Step 1: Deploy individual shard contracts first
//   const shardAddresses = [];

//   // Deploy 3 shard contracts with initial candidates
//   const candidates = ["Candidate 1", "Candidate 2", "Candidate 3"];

//   for (let i = 0; i < 3; i++) {
//     await deployer.deploy(ShardVoting, candidates, { from: accounts[0] });
//     const shardInstance = await ShardVoting.deployed();
//     shardAddresses.push(shardInstance.address);
//     console.log(`Shard ${i} deployed at: ${shardInstance.address}`);
//   }

//   // Step 2: Deploy the MainAggregator with shard addresses
//   await deployer.deploy(MainAggregator, shardAddresses, { from: accounts[0] });
//   const aggregatorInstance = await MainAggregator.deployed();
//   console.log(`MainAggregator deployed at: ${aggregatorInstance.address}`);

//   // Step 3: Deploy the RegionDeployment with aggregator address
//   await deployer.deploy(RegionDeployment, aggregatorInstance.address, { from: accounts[0] });
//   const regionDeploymentInstance = await RegionDeployment.deployed();
//   console.log(`RegionDeployment deployed at: ${regionDeploymentInstance.address}`);

//   // Step 4: Register all shards with the RegionDeployment contract
//   for (let i = 0; i < shardAddresses.length; i++) {
//     await regionDeploymentInstance.addShard(shardAddresses[i], { from: accounts[0] });
//     console.log(`Shard ${i} registered with RegionDeployment`);
//   }
// };
// const ShardVoting = artifacts.require("ShardVoting");
// const MainAggregator = artifacts.require("MainAggregator");
// const RegionDeployment = artifacts.require("RegionDeployment");

// module.exports = async function(deployer, network, accounts) {
//   // Define candidates for each region
//   const regionCandidates = [
//     ["Region 1 - Candidate A", "Region 1 - Candidate B", "Region 1 - Candidate C"],
//     ["Region 2 - Candidate A", "Region 2 - Candidate B", "Region 2 - Candidate C"],
//     ["Region 3 - Candidate A", "Region 3 - Candidate B", "Region 3 - Candidate C"]
//   ];

//   // Deploy RegionDeployment with the 2D array of candidates
//   // This will internally create all ShardVoting contracts and the MainAggregator
//   await deployer.deploy(RegionDeployment, regionCandidates, { from: accounts[0] });
//   const regionDeploymentInstance = await RegionDeployment.deployed();
//   console.log(`RegionDeployment deployed at: ${regionDeploymentInstance.address}`);

//   // Log the addresses of created contracts
//   const aggregatorAddress = await regionDeploymentInstance.aggregator();
//   console.log(`MainAggregator deployed at: ${aggregatorAddress}`);

//   // Log shard addresses
//   for (let i = 0; i < regionCandidates.length; i++) {
//     try {
//       const shardAddress = await regionDeploymentInstance.shards(i);
//       console.log(`Shard ${i} deployed at: ${shardAddress}`);
//     } catch (error) {
//       console.log(`Failed to get address for shard ${i}`);
//     }
//   }
// };
// const ShardVoting = artifacts.require("ShardVoting");
// const MainAggregator = artifacts.require("MainAggregator");
// const RegionDeployment = artifacts.require("RegionDeployment");

// module.exports = async function(deployer, network, accounts) {
//   // Define candidates for each region
//   const regionCandidates = [
//     ["Region 1 - Candidate A", "Region 1 - Candidate B", "Region 1 - Candidate C"],
//     ["Region 2 - Candidate A", "Region 2 - Candidate B", "Region 2 - Candidate C"],
//     ["Region 3 - Candidate A", "Region 3 - Candidate B", "Region 3 - Candidate C"]
//   ];

//   // Deploy individual ShardVoting contracts first
//   const shardAddresses = [];

//   for (let i = 0; i < regionCandidates.length; i++) {
//     await deployer.deploy(ShardVoting, regionCandidates[i], { from: accounts[0] });
//     const shardInstance = await ShardVoting.deployed();
//     shardAddresses.push(shardInstance.address);
//     console.log(`Shard ${i} deployed at: ${shardInstance.address}`);
//   }

//   // Deploy MainAggregator with shard addresses
//   await deployer.deploy(MainAggregator, shardAddresses, { from: accounts[0] });
//   const aggregatorInstance = await MainAggregator.deployed();
//   console.log(`MainAggregator deployed at: ${aggregatorInstance.address}`);

//   // Deploy RegionDeployment with aggregator address
//   await deployer.deploy(RegionDeployment, aggregatorInstance.address, { from: accounts[0] });
//   const regionDeploymentInstance = await RegionDeployment.deployed();
//   console.log(`RegionDeployment deployed at: ${regionDeploymentInstance.address}`);

//   // Register all shards with the RegionDeployment contract
//   for (let i = 0; i < shardAddresses.length; i++) {
//     await regionDeploymentInstance.addShard(shardAddresses[i], { from: accounts[0] });
//     console.log(`Shard ${i} registered with RegionDeployment`);
//   }
// };
const ShardVoting = artifacts.require("ShardVoting");
const MainAggregator = artifacts.require("MainAggregator");
const RegionDeployment = artifacts.require("RegionDeployment");

module.exports = async function (deployer, network, accounts) {
  // Define candidates for each region
  const regionCandidates = [
    ["Region 1 - Candidate A", "Region 1 - Candidate B", "Region 1 - Candidate C"],
    ["Region 2 - Candidate A", "Region 2 - Candidate B", "Region 2 - Candidate C"],
    ["Region 3 - Candidate A", "Region 3 - Candidate B", "Region 3 - Candidate C"]
  ];

  // Deploy RegionDeployment with the region candidates
  await deployer.deploy(RegionDeployment, regionCandidates, { from: accounts[0] });
  const regionDeploymentInstance = await RegionDeployment.deployed();
  console.log(`RegionDeployment deployed at: ${regionDeploymentInstance.address}`);

  // Get the aggregator address from the RegionDeployment contract
  const aggregatorAddress = await regionDeploymentInstance.aggregator();
  console.log(`MainAggregator deployed at: ${aggregatorAddress}`);

  // Log shard addresses and transfer ownership
  for (let i = 0; i < regionCandidates.length; i++) {
    const shardAddress = await regionDeploymentInstance.shards(i);
    console.log(`Shard ${i} deployed at: ${shardAddress}`);

    // Get the ShardVoting instance
    const shardInstance = await ShardVoting.at(shardAddress);

    // Transfer ownership to the deployer (accounts[0])
    await shardInstance.transferOwnership(accounts[0], { from: accounts[0] });
    console.log(`Transferred ownership of Shard ${i} to ${accounts[0]}`);
  }

  // Get the MainAggregator instance and transfer ownership
  const aggregatorInstance = await MainAggregator.at(aggregatorAddress);
  await aggregatorInstance.transferOwnership(accounts[0], { from: accounts[0] });
  console.log(`Transferred ownership of MainAggregator to ${accounts[0]}`);
};
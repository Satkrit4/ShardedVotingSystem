const Web3 = require('web3');
const web3 = new Web3('http://127.0.0.1:7545');
const RegionDeploymentABI = require('./src/contracts/RegionDeployment.json').abi;

async function checkOwner() {
  try {
    // Get the first account from Ganache
    const accounts = await web3.eth.getAccounts();
    console.log('Ganache first account:', accounts[0]);

    // Get the contract instance
    const contract = new web3.eth.Contract(
      RegionDeploymentABI,
      '0xb246aCE17a9D62CbD1F816B973fE6d0E104E7374'  // Updated contract address from new deployment
    );

    // Get the owner
    const owner = await contract.methods.owner().call();
    console.log('Contract owner:', owner);

    // Compare addresses
    console.log('\nAddress Comparison:');
    console.log('Ganache first account:', accounts[0]);
    console.log('Contract owner:', owner);
    console.log('\nAre they the same?', accounts[0].toLowerCase() === owner.toLowerCase());
  } catch (error) {
    console.error('Error:', error);
  }
}

checkOwner(); 
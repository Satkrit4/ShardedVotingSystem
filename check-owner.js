const Web3 = require('web3');
const web3 = new Web3('http://127.0.0.1:7545');
const RegionDeploymentABI = require('./src/contracts/RegionDeployment.json').abi;

async function checkOwner() {
  try {
    // Get the first account from Ganache
    const accounts = await web3.eth.getAccounts();
    console.log('Ganache first account:', accounts[0]);

    // Get the transaction that deployed the RegionDeployment contract
    const tx = await web3.eth.getTransaction('0x4ce4d0aea57947220ae15e621382a5b415e42ab2782d785150cda7cba2456d11');
    console.log('Deployer address:', tx.from);

    // Get the contract instance
    const contract = new web3.eth.Contract(
      RegionDeploymentABI,
      '0x1715aE45f4A4e840bc5666C52F599540983823aE'
    );

    // Get the owner
    const owner = await contract.methods.owner().call();
    console.log('Contract owner:', owner);

    // Compare addresses
    console.log('\nAddress Comparison:');
    console.log('Ganache first account:', accounts[0]);
    console.log('Deployer address:', tx.from);
    console.log('Contract owner:', owner);
    console.log('\nAre they the same?', accounts[0].toLowerCase() === tx.from.toLowerCase() && tx.from.toLowerCase() === owner.toLowerCase());
  } catch (error) {
    console.error('Error:', error);
  }
}

checkOwner(); 
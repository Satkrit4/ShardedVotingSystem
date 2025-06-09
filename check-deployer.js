import Web3 from 'web3';
const web3 = new Web3('http://127.0.0.1:7545');

async function checkDeployer() {
  try {
    // RegionDeployment contract deployment transaction
    const regionDeploymentTx = await web3.eth.getTransaction('0x67393e118aae6bfc615c5a31867c18699505150d2eb4901613562b0eae5d7969');
    console.log('RegionDeployment Deployer:', regionDeploymentTx.from);

    // MainAggregator contract deployment transaction
    const mainAggregatorTx = await web3.eth.getTransaction('0x4894958244b37d6ea778e415a9f8761f7c76da1b5d6db2490b634f325f1ce6f4');
    console.log('MainAggregator Deployer:', mainAggregatorTx.from);

    // Migrations contract deployment transaction
    const migrationsTx = await web3.eth.getTransaction('0xacaf4631efd0ee03632a96830fb08ecb863afa9f1e2eba6d74ff47a244005c81');
    console.log('Migrations Deployer:', migrationsTx.from);
  } catch (error) {
    console.error('Error:', error);
  }
}

checkDeployer(); 
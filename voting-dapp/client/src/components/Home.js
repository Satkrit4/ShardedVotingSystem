// // // import { useEffect, useState } from "react";
// // // import Box from "@mui/material/Box";
// // // import Vote from "./Vote";
// // // import Admin from "./Admin";
// // // import ElectionContract from "../contracts/Election.json";
// // // import getWeb3 from "../utils/getWeb3";

// // // export default function Home() {
// // //   const [role, setRole] = useState(2);
// // //   const [web3, setWeb3] = useState(null);
// // //   const [currentAccount, setCurrentAccount] = useState(null);
// // //   const [contract, setContract] = useState(null);
// // //   const [loading, setLoading] = useState(true);

// // //   const loadWeb3 = async () => {
// // //     try {
// // //       const web3 = await getWeb3();
// // //       const accounts = await web3.eth.getAccounts();
// // //       const networkId = await web3.eth.net.getId();
// // //       const deployedNetwork = ElectionContract.networks[networkId];
// // //       const instance = new web3.eth.Contract(
// // //         ElectionContract.abi,
// // //         deployedNetwork && deployedNetwork.address
// // //       );
// // //       setWeb3(web3);
// // //       setCurrentAccount(accounts[0]);
// // //       setContract(instance);
// // //       console.log("init");
// // //       setLoading(false);
// // //     } catch (error) {
// // //       console.error("Error:", error);
// // //     }
// // //   };

// // //   const getRole = async () => {
// // //     if (contract) {
// // //       const user = await contract.methods.getRole(currentAccount).call();
// // //       setRole(parseInt(user));
// // //       console.log("role:");
// // //       setLoading(false);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     loadWeb3();
// // //   }, []);

// // //   useEffect(() => {
// // //     getRole();
// // //   }, [contract]);

// // //   return (
// // //     <Box
// // //       sx={{
// // //         bgcolor: "background.default",
// // //         color: "text.primary",
// // //         height: "100vh",
// // //       }}
// // //     >
// // //       {loading ? (
// // //         <Box
// // //           sx={{
// // //             display: "flex",
// // //             justifyContent: "center",
// // //             alignItems: "center",
// // //             height: "80vh",
// // //           }}
// // //         >
// // //           Loading...
// // //         </Box>
// // //       ) : (
// // //         <Box>
// // //           {role === 1 && (
// // //             <Admin
// // //               role={role}
// // //               contract={contract}
// // //               web3={web3}
// // //               currentAccount={currentAccount}
// // //             />
// // //           )}

// // //           {role === 2 && (
// // //             <Vote
// // //               role={role}
// // //               contract={contract}
// // //               web3={web3}
// // //               currentAccount={currentAccount}
// // //             />
// // //           )}

// // //           {role === 3 && (
// // //             <Box
// // //               sx={{
// // //                 display: "flex",
// // //                 justifyContent: "center",
// // //                 alignItems: "center",
// // //                 height: "80vh",
// // //               }}
// // //             >
// // //               Unauthorized User
// // //             </Box>
// // //           )}
// // //         </Box>
// // //       )}
// // //     </Box>
// // //   );
// // // }
// // import { useEffect, useState } from "react";
// // import Box from "@mui/material/Box";
// // import Vote from "../screens/Vote";
// // import Admin from "../screens/Admin";
// // import getWeb3 from "../utils/getWeb3";
// // import Navbar from "./Navbar";


// // export default function Home() {
// //     const [role, setRole] = useState(2);
// //     const [web3, setWeb3] = useState(null);
// //     const [currentAccount, setCurrentAccount] = useState(null);
// //     const [shardContracts, setShardContracts] = useState([]);
// //     const [aggregatorContract, setAggregatorContract] = useState(null);
// //     const [loading, setLoading] = useState(false);
// //     const [electionContract, setElectionContract] = useState(null);

// //     const loadWeb3 = async () => {
// //         try {
// //             const { web3, accounts, shardContracts, aggregatorContract, electionContract } = await getWeb3();
// //             if (!shardContracts.length || !aggregatorContract) {
// //                 throw new Error("Contracts not loaded properly");
// //             }
// //             setWeb3(web3);
// //             setCurrentAccount(accounts[0]);
// //             setShardContracts(shardContracts);
// //             setAggregatorContract(aggregatorContract);
// //             setElectionContract(electionContract);
// //             setLoading(false);
// //         } catch (error) {
// //             console.error("Error loading Web3:", error);
// //         }
// //     };

// //     const getRole = async () => {
// //         if (!electionContract || !currentAccount) return;
// //         try {
// //             // if (!electionContract || !currentAccount) return;
// //             // const user = await shardContracts[0].methods.getRole(currentAccount).call();
// //             // setRole(parseInt(user));
// //             // setLoading(false);
// //             const userRole = await electionContract.methods.getRole(currentAccount).call();
// //             console.log("Fetched Role: ", userRole);
// //         setRole(parseInt(userRole));
// //         setLoading(false);
// //         } catch (error) {
// //             console.error("Error getting user role:", error);
// //         }
// //     };

// //     const onDisconnect = () => {
// //         setWeb3(null);
// //         setCurrentAccount(null);
// //         setShardContracts([]);
// //         setAggregatorContract(null);
// //         setRole(2);
// //         setLoading(true);
// //     };

// //     useEffect(() => {
// //         loadWeb3();
// //     }, []);

// //     useEffect(() => {
// //         if (currentAccount) getRole();
// //     }, [shardContracts]);

// //     return (
// //       <Box sx={{ bgcolor: "background.default", color: "text.primary", height: "100vh" }}>
// //           <Navbar web3={web3} account={currentAccount} onDisconnect={onDisconnect} />
// //           {loading ? (
// //               <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
// //                   Loading...
// //               </Box>
// //           ) : (
// //               <Box>
// //                   {role === 1 && (
// //                       <Admin role={role} contract={electionContract} aggregatorContract={aggregatorContract} web3={web3} currentAccount={currentAccount} />
// //                   )}

// //                   {role === 2 && (
// //                       <Vote role={role} shardContracts={shardContracts} web3={web3} currentAccount={currentAccount} />
// //                   )}
         
// //                   {role === 3 && (
// //                       <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
// //                       Unauthorized User
// //                   </Box>
// //                   )}
// //               </Box>
// //           )}
// //       </Box>
// //   );
// // }
// import React from 'react';
// import { Link } from 'react-router-dom';
// import './Home.css';

// function Home() {
//   return (
//     <div className="home-container">
//       <h1>Welcome to the Blockchain Voting System</h1>
//       <p>This is a decentralized voting application built on Ethereum blockchain with sharding technology.</p>
      
//       <div className="features">
//         <div className="feature-card">
//           <h3>Secure Voting</h3>
//           <p>Your vote is securely recorded on the blockchain, ensuring transparency and immutability.</p>
//         </div>
        
//         <div className="feature-card">
//           <h3>Regional Sharding</h3>
//           <p>Our system uses sharding technology to divide voting by regions, improving scalability and efficiency.</p>
//         </div>
        
//         <div className="feature-card">
//           <h3>Real-time Results</h3>
//           <p>View aggregated results from all regions in real-time as votes are cast.</p>
//         </div>
//       </div>
      
//       <div className="cta-buttons">
//         <Link to="/regions" className="btn btn-primary">Cast Your Vote</Link>
//         <Link to="/results" className="btn btn-secondary">View Results</Link>
//       </div>
//     </div>
//   );
// }

// export default Home;
import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import BarChartIcon from '@mui/icons-material/BarChart';
import PublicIcon from '@mui/icons-material/Public';

function Home() {
  return (
    <Box sx={{ mt: 8, textAlign: 'center' }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Welcome to the Sharded Voting System
      </Typography>
      
      <Typography variant="h6" color="text.secondary" paragraph>
        A secure, transparent, and efficient blockchain-based voting platform
      </Typography>
      
      <Box sx={{ mt: 4, mb: 8 }}>
        <Button 
          variant="contained" 
          size="large" 
          component={Link} 
          to="/regions"
          sx={{ mr: 2 }}
        >
          Start Voting
        </Button>
        
        <Button 
          variant="outlined" 
          size="large" 
          component={Link} 
          to="/results"
        >
          View Results
        </Button>
      </Box>
      
      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <HowToVoteIcon fontSize="large" color="primary" sx={{ mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Secure Voting
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Cast your vote securely using blockchain technology. Each vote is recorded immutably and cannot be tampered with.
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
              <Button size="small" component={Link} to="/regions">Vote Now</Button>
            </CardActions>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <PublicIcon fontSize="large" color="primary" sx={{ mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Regional Voting
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Our sharded architecture allows for regional voting, improving scalability and efficiency across the network.
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
              <Button size="small" component={Link} to="/regions">Select Region</Button>
            </CardActions>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <BarChartIcon fontSize="large" color="primary" sx={{ mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Live Results
              </Typography>
              <Typography variant="body1" color="text.secondary">
                View real-time voting results aggregated across all regions, ensuring complete transparency in the election process.
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
              <Button size="small" component={Link} to="/results">View Results</Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Home;
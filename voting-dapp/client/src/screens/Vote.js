// import { useEffect, useState } from "react";
// import Box from "@mui/material/Box";
// import Grid from "@mui/material/Grid";
// import Button from "@mui/material/Button";
// import Typography from "@mui/material/Typography";
// import Divider from "@mui/material/Divider";

// import Radio from "@mui/material/Radio";
// import RadioGroup from "@mui/material/RadioGroup";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import FormControl from "@mui/material/FormControl";
// import getWeb3 from "../utils/getWeb3";
// import Candidate from "../components/CandidateCard";

// export default function Vote() {
//   // const [loading, setLoading] = useState(true);
//   //updated
//   const [web3, setWeb3] = useState(null);
//   const [shardContracts, setShardContracts] = useState([]);

//   const [account, setAccount] = useState(null);

//   const [candidates, setCandidates] = useState([]);
//   const [vote, setVote] = useState(null);
//   const [electionState, setElectionState] = useState(0);
//   const [shardIndex, setShardIndex] = useState(null);
//   const [open, setOpen] = useState(false);

//   useEffect(() => {
//     const init = async () => {
//     const { web3, accounts, shardContracts } =
//       await getWeb3();
//     setWeb3(web3);
//     setAccount(accounts[0]);
//     setShardContracts(shardContracts);
//     // Assign voter to a shard dynamically
//     const index = accounts[0].charCodeAt(accounts[0].length - 1) % shardContracts.length;
//     setShardIndex(index);
//     getElectionState();
//     getCandidates();
//     };
//     init();
//   }, []);


//   // const getCandidates = async () => {
//   //   if (contract) {
//   //     const count = await contract.methods.candidatesCount().call();
//   //     const temp = [];
//   //     for (let i = 0; i < count; i++) {
//   //       const candidate = await contract.methods.getCandidateDetails(i).call();
//   //       temp.push({ name: candidate[0], votes: candidate[1] });
//   //     }
//   //     setCandidates(temp);
//   //     // setLoading(false);
//   //   }
//   // };

//   //updated  
//   const getCandidates = async (contract) => {
//       const count = await contract.methods.candidatesCount().call();
//       const temp = [];
//       for (let i = 0; i < count; i++) {
//         const candidate = await contract.methods.getCandidateDetails(i).call();
//           temp.push({ name: candidate[0], votes: candidate[1] });
//       }
//       setCandidates(temp);
//   };

//   // const voteCandidate = async (candidate) => {
//   //   try {
//   //     if (contract) {
//   //       await contract.methods.vote(candidate).send({ from: currentAccount });
//   //       getCandidates();
//   //     }
//   //   } catch (error) {
//   //     console.error("Error:", error);
//   //   }
//   // };

//   //updated
//   const voteCandidate = async (candidateId) => {
//     try {
//         if (!shardContracts.length || shardIndex === null) return;
//         const contract = shardContracts[shardIndex];
        
//         await contract.methods.vote(candidateId).send({ from: account });
//         console.log("Vote casted in shard", shardIndex);

//         // Listen for vote event
//         contract.events.VoteCasted({}, async () => {
//             console.log("Vote event detected, updating UI...");
//             getCandidates(contract);
//         });
//     } catch (error) {
//         console.error("Error voting:", error);
//     }
// };

// const getElectionState = async () => {
//     if (contract) {
//       const state = await contract.methods.electionState().call();
//       setElectionState(parseInt(state));
//     }
//   };


//   const handleVoteChange = (event) => {
//     setVote(event.target.value);
//   };

//   // const handleVote = (event) => {
//   //   event.preventDefault();
//   //   voteCandidate(0, index);
//   // };

//   return (
//     <Box>
//       <form onSubmit={voteCandidate(vote)}>
//         <Grid container sx={{ mt: 0 }} spacing={6} justifyContent="center">
//           <Grid item xs={12}>
//             <Typography align="center" variant="h6">
//               {electionState === 0 &&
//                 "Please Wait... Election has not started yet."}
//               {electionState === 1 && "VOTE FOR YOUR FAVOURITE CANDIDATE"}
//               {electionState === 2 &&
//                 "Election has ended. See the results below."}
//             </Typography>
//             <Divider />
//           </Grid>
//           {electionState === 1 && (
//             <>
//               <Grid item xs={12}>
//                 <FormControl>
//                   <RadioGroup
//                     row
//                     sx={{
//                       overflowY: "hidden",
//                       overflowX: "auto",
//                       display: "flex",
//                       width: "98vw",
//                       justifyContent: "center",
//                     }}
//                     value={vote}
//                     onChange={handleVoteChange}
//                   >
//                     {candidates.map((candidate, index) => (
//                       <FormControlLabel
//                         key={index}
//                         labelPlacement="top"
//                         control={<Radio />}
//                         value={index}
//                         label={<Candidate id={index} name={candidate.name} />}
//                       />
//                     ))}
//                   </RadioGroup>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={6}>
//                 <div style={{ margin: 20 }}>
//                   <Button
//                     type="submit"
//                     variant="contained"
//                     sx={{ width: "100%" }}
//                   >
//                     Vote
//                   </Button>
//                 </div>
//               </Grid>
//             </>
//           )}

//           {electionState === 2 && (
//             <Grid
//               item
//               xs={12}
//               sx={{
//                 overflowY: "hidden",
//                 overflowX: "auto",
//                 display: "flex",
//                 width: "98vw",
//                 justifyContent: "center",
//               }}
//             >
//               {candidates &&
//                 candidates.map((candidate, index) => (
//                   <Box sx={{ mx: 2 }} key={index}>
//                     <Candidate
//                       id={index}
//                       name={candidate.name}
//                       voteCount={candidate.votes}
//                     />
//                   </Box>
//                 ))}
//             </Grid>
//           )}
//         </Grid>
//       </form>
//     </Box>
//   );
// }
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import getWeb3 from "../utils/getWeb3";
import Candidate from "../components/CandidateCard";

export default function Vote() {
  const [web3, setWeb3] = useState(null);
  const [shardContracts, setShardContracts] = useState([]);
  const [account, setAccount] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [vote, setVote] = useState(null);
  const [electionState, setElectionState] = useState(0);
  const [shardIndex, setShardIndex] = useState(null);
  const [error, setError] = useState(null);
  const [electionContract, setElectionContract] = useState(null);


  useEffect(() => {
    const init = async () => {
      try {
        const { web3, accounts, shardContracts, electionContract } = await getWeb3();
        if (!shardContracts.length) {
            throw new Error("Shard contracts not loaded properly");
        }
        setWeb3(web3);
        setAccount(accounts[0]);
        setShardContracts(shardContracts);
        setElectionContract(electionContract);
        // Assign voter to a shard dynamically
        const index = accounts[0].charCodeAt(accounts[0].length - 1) % shardContracts.length;
        setShardIndex(index);
  
        getElectionState();
        getCandidates();
      } catch(error) {
        console.error(error);
      }
    };
    init();
  }, []);

  const getElectionState = async () => {
    if (!electionContract) {
      console.warn("⚠️ Election contract not loaded.");
      return;
    }
    try {
      const state = await electionContract.methods.electionState().call();
      setElectionState(parseInt(state));
      console.log("✅ Election state:", state);
    } catch (error) {
      console.error("❌ Error fetching election state:", error);
    }
  };

  const getCandidates = async () => {
    if (!shardContracts.length || shardIndex === null) return;
    try {
      const contract = shardContracts[shardIndex];
      const count = await contract.methods.candidatesCount().call();
      const candidatePromises = Array.from({ length: count }, (_, i) =>
          contract.methods.getCandidateDetails(i).call()
      );
      const candidateResults = await Promise.all(candidatePromises);
      setCandidates(candidateResults.map(([name, votes]) => ({ name, votes })));
  } catch (error) {
      console.error("Error fetching candidates:", error);
      setError("Failed to fetch candidates");
    }
  };

  const voteCandidate = async (candidateId) => {
    try {
      if (!shardContracts.length || shardIndex === null) return;
      const contract = shardContracts[shardIndex];

      await contract.methods.vote(candidateId).send({ from: account });
      console.log("Vote casted in shard", shardIndex);

      // Listen for vote event
      contract.events.VoteCasted({}, async () => {
        console.log("Vote event detected, updating UI...");
        getCandidates();
      });
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const handleVoteChange = (event) => {
    setVote(event.target.value);
  };

  return (
    <Box>
      <form onSubmit={(e) => { e.preventDefault(); voteCandidate(vote); }}>
        <Grid container sx={{ mt: 0 }} spacing={6} justifyContent="center">
          <Grid item xs={12}>
            <Typography align="center" variant="h6">
              {electionState === 0 && "Please Wait... Election has not started yet."}
              {electionState === 1 && "VOTE FOR YOUR FAVOURITE CANDIDATE"}
              {electionState === 2 && "Election has ended. See the results below."}
            </Typography>
            <Divider />
          </Grid>
          {electionState === 1 && (
            <>
              <Grid item xs={12}>
                <FormControl>
                  <RadioGroup
                    row
                    sx={{
                      overflowY: "hidden",
                      overflowX: "auto",
                      display: "flex",
                      width: "98vw",
                      justifyContent: "center",
                    }}
                    value={vote}
                    onChange={handleVoteChange}
                  >
                    {candidates.map((candidate, index) => (
                      <FormControlLabel
                        key={index}
                        labelPlacement="top"
                        control={<Radio />}
                        value={index}
                        label={<Candidate id={index} name={candidate.name} />}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <div style={{ margin: 20 }}>
                  <Button type="submit" variant="contained" sx={{ width: "100%" }}>
                    Vote
                  </Button>
                </div>
              </Grid>
            </>
          )}

          {electionState === 2 && (
            <Grid
              item
              xs={12}
              sx={{
                overflowY: "hidden",
                overflowX: "auto",
                display: "flex",
                width: "98vw",
                justifyContent: "center",
              }}
            >
              {candidates &&
                candidates.map((candidate, index) => (
                  <Box sx={{ mx: 2 }} key={index}>
                    <Candidate
                      id={index}
                      name={candidate.name}
                      voteCount={candidate.votes}
                    />
                  </Box>
                ))}
            </Grid>
          )}
        </Grid>
      </form>
    </Box>
  );
}

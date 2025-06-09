import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Alert from "@mui/material/Alert";
import CandidateCard from "./CandidateCard";
import './VotingPage.css';

function VotingPage({ web3, account, shards }) {
  const { regionId } = useParams();
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [electionActive, setElectionActive] = useState(false);
  const [electionEnded, setElectionEnded] = useState(false);

  useEffect(() => {
    const loadCandidatesAndStatus = async () => {
      try {
        setLoading(true);
        setError('');

        // Check if shards are loaded and the requested shard exists
        if (!shards.length || parseInt(regionId) >= shards.length) {
          setError('Invalid region or shards not loaded');
          setLoading(false);
          return;
        }

        const shardContract = shards[parseInt(regionId)].instance;

        // Check election state
        const isActive = await shardContract.methods.electionActive().call();
        const isEnded = await shardContract.methods.electionEnded().call();
        setElectionActive(isActive);
        setElectionEnded(isEnded);

        // Check voter status
        const voter = await shardContract.methods.voters(account).call();
        setHasVoted(voter.hasVoted);
        setIsRegistered(voter.isRegistered);

        // Get candidates from the shard
        let i = 0;
        let hasMoreCandidates = true;
        const candidatesList = [];

        while (hasMoreCandidates) {
          try {
            const candidate = await shardContract.methods.candidates(i).call();
            candidatesList.push({
              id: candidate.id,
              name: candidate.name,
              voteCount: candidate.voteCount
            });
            i++;
          } catch (error) {
            hasMoreCandidates = false;
          }
        }

        setCandidates(candidatesList);
        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setError('Failed to load election data. Please try again.');
        setLoading(false);
      }
    };

    if (web3 && account && shards.length > 0) {
      loadCandidatesAndStatus();
    }
  }, [web3, account, shards, regionId]);

  const handleVote = async () => {
    if (!selectedCandidate) {
      setError('Please select a candidate');
      return;
    }

    try {
      setIsVoting(true);
      setError('');

      const shardContract = shards[parseInt(regionId)].instance;

      // Check if election is active
      if (!electionActive) {
        setError('Election is not active');
        setIsVoting(false);
        return;
      }

      if (electionEnded) {
        setError('Election has ended');
        setIsVoting(false);
        return;
      }

      // Cast vote
      await shardContract.methods.vote(selectedCandidate).send({ from: account });

      setSuccess('Your vote has been recorded successfully!');
      setHasVoted(true);
      setIsVoting(false);

      // Redirect to results after a short delay
      setTimeout(() => {
        navigate('/results');
      }, 3000);
    } catch (error) {
      console.error("Error voting:", error);
      let errorMessage = 'Failed to cast vote. Please try again.';

      // Handle specific error messages
      if (error.message.includes("Not registered to vote")) {
        errorMessage = "You are not registered to vote in this region.";
      } else if (error.message.includes("Already voted")) {
        errorMessage = "You have already voted in this election.";
      } else if (error.message.includes("Election is not active")) {
        errorMessage = "The election is not currently active.";
      }

      setError(errorMessage);
      setIsVoting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Typography>Loading election data...</Typography>
      </Box>
    );
  }

  // Show appropriate messages based on election and voter status
  if (!isRegistered) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          You are not registered to vote in this region. Please contact the administrator to register.
        </Alert>
        <Button variant="outlined" onClick={() => navigate('/regions')}>
          Back to Regions
        </Button>
      </Box>
    );
  }

  if (!electionActive) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          The election has not started yet. Please wait for the administrator to start the election.
        </Alert>
        <Button variant="outlined" onClick={() => navigate('/regions')}>
          Back to Regions
        </Button>
      </Box>
    );
  }

  if (electionEnded) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          This election has ended. You can view the results.
        </Alert>
        <Button variant="contained" onClick={() => navigate('/results')}>
          View Results
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Vote in Region {parseInt(regionId) + 1}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {hasVoted ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            You have already voted in this region
          </Typography>
          <Typography variant="body1" gutterBottom>
            Thank you for participating in the election!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/results')}
            sx={{ mt: 2 }}
          >
            View Results
          </Button>
        </Box>
      ) : (
        <>
          <Typography variant="body1" gutterBottom>
            Please select a candidate to cast your vote:
          </Typography>

          <Grid container spacing={3} sx={{ mt: 2 }}>
            {candidates.map(candidate => (
              <Grid item xs={12} sm={6} md={4} key={candidate.id}>
                <CandidateCard
                  candidate={candidate}
                  selected={selectedCandidate === candidate.id.toString()}
                  onSelect={() => setSelectedCandidate(candidate.id.toString())}
                />
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleVote}
              disabled={isVoting || !selectedCandidate}
            >
              {isVoting ? 'Casting Vote...' : 'Cast Vote'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/regions')}
            >
              Back to Regions
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}

export default VotingPage;
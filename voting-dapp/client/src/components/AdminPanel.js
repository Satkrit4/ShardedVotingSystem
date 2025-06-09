import React, { useState, useEffect } from 'react';
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Alert from "@mui/material/Alert";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CircularProgress from "@mui/material/CircularProgress";

function AdminPanel({ web3, account, shards, aggregator }) {
  const [voterAddress, setVoterAddress] = useState('');
  const [selectedShard, setSelectedShard] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [voters, setVoters] = useState([]);
  const [electionState, setElectionState] = useState('NotStarted');
  const [isOwner, setIsOwner] = useState(false);
  const [ownerAddress, setOwnerAddress] = useState('');

  useEffect(() => {
    if (shards && shards.length > 0) {
      loadVoters();
      checkElectionState();
      checkOwnerStatus();
    }
  }, [shards, selectedShard, account]);

  const checkOwnerStatus = async () => {
    try {
      const shardContract = shards[selectedShard].instance;
      const owner = await shardContract.methods.owner().call();
      setOwnerAddress(owner);
      const isOwnerAccount = owner.toLowerCase() === account.toLowerCase();
      setIsOwner(isOwnerAccount);

      if (!isOwnerAccount) {
        setError(`Only the contract owner can perform administrative actions. Current owner: ${owner}`);
      }
    } catch (error) {
      console.error("Error checking owner status:", error);
    }
  };

  const loadVoters = async () => {
    try {
      setLoading(true);
      const shardContract = shards[selectedShard].instance;

      // Get all voters from the shard
      const votersList = [];

      // Get the first 100 accounts from the network
      const accounts = await web3.eth.getAccounts();

      // Check each account if they are registered
      for (const address of accounts) {
        try {
          const voter = await shardContract.methods.voters(address).call();
          if (voter.isRegistered) {
            votersList.push({
              address: address,
              hasVoted: voter.hasVoted
            });
          }
        } catch (error) {
          console.log(`Error checking voter ${address}:`, error);
        }
      }

      setVoters(votersList);
    } catch (error) {
      console.error("Error loading voters:", error);
      setError('Failed to load voters');
    } finally {
      setLoading(false);
    }
  };

  const checkElectionState = async () => {
    try {
      const shardContract = shards[selectedShard].instance;
      const isActive = await shardContract.methods.electionActive().call();
      const isEnded = await shardContract.methods.electionEnded().call();

      if (isEnded) {
        setElectionState('Ended');
      } else if (isActive) {
        setElectionState('InProgress');
      } else {
        setElectionState('NotStarted');
      }
    } catch (error) {
      console.error("Error checking election state:", error);
    }
  };

  const handleAddVoter = async () => {
    if (!isOwner) {
      setError('Only the contract owner can register voters');
      return;
    }

    if (!web3.utils.isAddress(voterAddress)) {
      setError('Please enter a valid Ethereum address');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setMessage('');

      const shardContract = shards[selectedShard].instance;

      // First check if the voter is already registered
      const voter = await shardContract.methods.voters(voterAddress).call();
      if (voter.isRegistered) {
        setError('This voter is already registered');
        setLoading(false);
        return;
      }

      // Register voter in the shard
      await shardContract.methods.registerVoter(voterAddress)
        .send({
          from: account,
          gas: 300000, // Fixed gas limit
          gasPrice: await web3.eth.getGasPrice() // Get current gas price
        });

      setMessage(`Voter ${voterAddress} has been added to Region ${selectedShard + 1}`);
      setVoterAddress('');

      // Reload voters list
      await loadVoters();
    } catch (error) {
      console.error("Error adding voter:", error);

      // More detailed error handling
      if (error.code === 4001) {
        setError('Transaction was rejected by the user');
      } else if (error.message.includes("revert")) {
        const revertReason = error.message.split('revert')[1]?.trim() || '';
        setError(`Transaction reverted: ${revertReason || 'You may not have permission to register voters'}`);
      } else if (error.message.includes("Internal JSON-RPC error")) {
        setError('Transaction failed. Please check your gas settings and try again.');
      } else {
        setError(error.message || 'Failed to add voter');
      }
    } finally {
      setLoading(false);
    }
  };

  const startElection = async () => {
    if (!isOwner) {
      setError('Only the contract owner can start the election');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setMessage('');

      const shardContract = shards[selectedShard].instance;

      // Start election in the shard
      await shardContract.methods.startElection().send({ from: account });

      setMessage('Election has been started');
      setElectionState('InProgress');
    } catch (error) {
      console.error("Error starting election:", error);
      setError(error.message || 'Failed to start election');
    } finally {
      setLoading(false);
    }
  };

  const endElection = async () => {
    if (!isOwner) {
      setError('Only the contract owner can end the election');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setMessage('');

      const shardContract = shards[selectedShard].instance;

      // End election in the shard
      await shardContract.methods.endElection().send({ from: account });

      setMessage('Election has been ended');
      setElectionState('Ended');
    } catch (error) {
      console.error("Error ending election:", error);
      setError(error.message || 'Failed to end election');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 4, p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Admin Panel
      </Typography>

      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {!isOwner && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="body1" gutterBottom>
            You are not the contract owner. Only the owner can perform administrative actions.
          </Typography>
          <Typography variant="body2">
            Current owner: {ownerAddress}
          </Typography>
          <Typography variant="body2">
            Your address: {account}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Please switch to the owner account in MetaMask to perform administrative actions.
          </Typography>
        </Alert>
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Manage Region {selectedShard + 1}
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ mb: 2 }}>
                <TextField
                  label="Select Region"
                  select
                  fullWidth
                  value={selectedShard}
                  onChange={(e) => setSelectedShard(parseInt(e.target.value))}
                  SelectProps={{
                    native: true,
                  }}
                  sx={{ mb: 2 }}
                >
                  {shards.map((shard) => (
                    <option key={shard.id} value={shard.id}>
                      Region {shard.id + 1}
                    </option>
                  ))}
                </TextField>

                <TextField
                  label="Voter Ethereum Address"
                  fullWidth
                  value={voterAddress}
                  onChange={(e) => setVoterAddress(e.target.value)}
                  sx={{ mb: 2 }}
                />

                <Button
                  variant="contained"
                  onClick={handleAddVoter}
                  disabled={loading || !voterAddress || !isOwner}
                  fullWidth
                >
                  Add Voter
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Election Control
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Current State: {electionState}
                </Typography>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={startElection}
                  disabled={loading || electionState !== 'NotStarted' || !isOwner}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  Start Election
                </Button>

                <Button
                  variant="contained"
                  color="secondary"
                  onClick={endElection}
                  disabled={loading || electionState !== 'InProgress' || !isOwner}
                  fullWidth
                >
                  End Election
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Registered Voters
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <List>
                  {voters.map((voter, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={voter.address}
                        secondary={voter.hasVoted ? 'Has voted' : 'Has not voted'}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AdminPanel;
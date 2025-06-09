import React, { useState, useEffect } from 'react';
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

function Results({ web3, shards, aggregator }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shardResults, setShardResults] = useState([]);
  const [electionState, setElectionState] = useState('NotStarted');

  useEffect(() => {
    const loadResults = async () => {
      try {
        setLoading(true);
        setError('');

        if (!shards.length || !aggregator) {
          setError('Contracts not loaded properly');
          return;
        }

        // Check election state from the first shard
        const firstShard = shards[0].instance;
        const isActive = await firstShard.methods.electionActive().call();
        const isEnded = await firstShard.methods.electionEnded().call();

        if (isEnded) {
          setElectionState('Ended');
        } else if (isActive) {
          setElectionState('InProgress');
        } else {
          setElectionState('NotStarted');
        }

        // Get results from each shard
        const shardResultsList = [];
        for (const shard of shards) {
          // Get candidates for this shard
          const candidates = [];
          let i = 0;
          let hasMoreCandidates = true;

          while (hasMoreCandidates) {
            try {
              const candidate = await shard.instance.methods.candidates(i).call();
              candidates.push({
                name: candidate.name,
                voteCount: parseInt(candidate.voteCount)
              });
              i++;
            } catch (error) {
              hasMoreCandidates = false;
            }
          }

          shardResultsList.push({
            id: shard.id,
            name: `Region ${shard.id + 1}`,
            results: candidates
          });
        }
        setShardResults(shardResultsList);
        setLoading(false);
      } catch (error) {
        console.error("Error loading results:", error);
        setError('Failed to load results. Please try again.');
        setLoading(false);
      }
    };

    loadResults();
  }, [web3, shards, aggregator]);

  const calculatePercentage = (votes, total) => {
    if (total === 0) return 0;
    return Math.round((votes / total) * 100);
  };

  const getTotalVotes = (results) => {
    return results.reduce((total, candidate) => total + candidate.voteCount, 0);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Election Results
      </Typography>

      <Alert severity={electionState === 'Ended' ? 'success' : 'info'} sx={{ mb: 3 }}>
        Election Status: {electionState}
      </Alert>

      <Grid container spacing={3}>
        {shardResults.map((region) => (
          <Grid item xs={12} md={6} key={region.id}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {region.name}
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {region.results.map((candidate, index) => {
                  const totalVotes = getTotalVotes(region.results);
                  const percentage = calculatePercentage(candidate.voteCount, totalVotes);

                  return (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        {candidate.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            height: 20,
                            bgcolor: 'primary.main',
                            width: `${percentage}%`,
                            borderRadius: 1
                          }}
                        />
                        <Typography>
                          {candidate.voteCount} votes ({percentage}%)
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}

                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                  Total Votes: {getTotalVotes(region.results)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Results;
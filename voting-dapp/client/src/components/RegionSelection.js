// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import './RegionSelection.css';

// function RegionSelection({ shards }) {
//   const [regions, setRegions] = useState([]);

//   useEffect(() => {
//     const loadRegions = async () => {
//       const regionsList = shards.map(shard => ({
//         id: shard.id,
//         name: `Region ${shard.id + 1}`
//       }));
//       setRegions(regionsList);
//     };

//     loadRegions();
//   }, [shards]);

//   return (
//     <div className="region-selection">
//       <h2>Select Your Voting Region</h2>
//       <p>Please select the region where you are registered to vote:</p>

//       <div className="regions-grid">
//         {regions.map(region => (
//           <Link 
//             to={`/vote/${region.id}`} 
//             key={region.id} 
//             className="region-card"
//           >
//             <h3>{region.name}</h3>
//             <p>Click to proceed to voting</p>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default RegionSelection;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import Alert from "@mui/material/Alert";

function RegionSelection({ shards, userShard }) {
  const navigate = useNavigate();

  if (!shards || shards.length === 0) {
    return (
      <Box sx={{ mt: 4, p: 2 }}>
        <Alert severity="warning">
          No voting regions are available. Please check back later.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4, p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Select Voting Region
      </Typography>

      {userShard !== null ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          You are assigned to Region {userShard + 1}, but you can view information about all regions.
        </Alert>
      ) : (
        <Alert severity="warning" sx={{ mb: 3 }}>
          You are not registered to vote in any region. Please contact the administrator to register.
        </Alert>
      )}

      <Grid container spacing={3}>
        {shards.map((shard) => (
          <Grid item xs={12} sm={6} md={4} key={shard.id}>
            <Card
              sx={{
                height: '100%',
                borderLeft: shard.id === userShard ? '5px solid #2196f3' : 'none'
              }}
            >
              <CardActionArea
                sx={{ height: '100%' }}
                onClick={() => navigate(`/vote/${shard.id}`)}
              >
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Region {shard.id + 1}
                  </Typography>

                  {shard.id === userShard && (
                    <Typography variant="body2" color="primary" sx={{ mb: 2 }}>
                      Your assigned region
                    </Typography>
                  )}

                  <Typography variant="body2" color="text.secondary">
                    Contract Address: {shard.address.substring(0, 8)}...{shard.address.substring(36)}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default RegionSelection;
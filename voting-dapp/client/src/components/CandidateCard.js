// import * as React from "react";
// import Card from "@mui/material/Card";
// import CardHeader from "@mui/material/CardHeader";
// import CardActions from "@mui/material/CardActions";
// import CardContent from "@mui/material/CardContent";
// import CardMedia from "@mui/material/CardMedia";
// import Typography from "@mui/material/Typography";

// export default function Candidate({ id, name, voteCount }) {
//   const IMG =
//     "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=1400";

//   return (
//     <Card sx={{ maxWidth: 345, minWidth: 300 }}>
//       <CardHeader
//         title={
//           <Typography align="center" variant="subtitle1">
//             {name}
//           </Typography>
//         }
//       />
//       <CardContent sx={{ padding: 0 }}>
//         <CardMedia
//           component="img"
//           alt="green iguana"
//           height="140"
//           image={IMG}
//         />
//       </CardContent>
//       <CardActions sx={{ justifyContent: "center" }}>
//         {voteCount && (
//           <Typography align="center" variant="">
//             <strong>{voteCount}</strong> votes
//           </Typography>
//         )}
//       </CardActions>
//     </Card>
//   );
// }
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import Box from '@mui/material/Box';

function CandidateCard({ candidate, selected, onSelect }) {
  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: selected ? '2px solid #1976d2' : '1px solid rgba(0, 0, 0, 0.12)',
        '&:hover': {
          border: '2px solid #1976d2',
          cursor: 'pointer'
        }
      }}
      onClick={onSelect}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="div" gutterBottom>
          {candidate.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Candidate ID: {candidate.id}
        </Typography>
      </CardContent>
      <CardActions>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', p: 1 }}>
          <Radio
            checked={selected}
            onChange={onSelect}
            value={candidate.id.toString()}
            name="candidate-selection"
          />
          <Typography variant="body2" sx={{ ml: 1 }}>
            {selected ? 'Selected' : 'Select'}
          </Typography>
        </Box>
      </CardActions>
    </Card>
  );
}

export default CandidateCard;
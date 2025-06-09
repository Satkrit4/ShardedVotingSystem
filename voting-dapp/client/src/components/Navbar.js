// // // import * as React from "react";
// // // import AppBar from "@mui/material/AppBar";
// // // import Box from "@mui/material/Box";
// // // import Toolbar from "@mui/material/Toolbar";
// // // import IconButton from "@mui/material/IconButton";
// // // import Typography from "@mui/material/Typography";
// // // import Menu from "@mui/material/Menu";
// // // import Container from "@mui/material/Container";
// // // import Avatar from "@mui/material/Avatar";
// // // import Tooltip from "@mui/material/Tooltip";
// // // import MenuItem from "@mui/material/MenuItem";
// // // import HowToVoteIcon from "@mui/icons-material/HowToVote";
// // // import { useNavigate } from "react-router-dom";

// // // const settings = ["Logout"];

// // // const Navbar = () => {
// // //   const navigate = useNavigate();
// // //   const [anchorElUser, setAnchorElUser] = React.useState(null);

// // //   const handleOpenUserMenu = (event) => {
// // //     setAnchorElUser(event.currentTarget);
// // //   };

// // //   const handleCloseUserMenu = () => {
// // //     setAnchorElUser(null);
// // //   };

// // //   const handleSetting = (event) => {
// // //     switch (event.currentTarget.innerText) {
// // //       case "Profile":
// // //         console.log("Profile");
// // //         break;
// // //       case "Logout":
// // //         navigate("/");
// // //         console.log("Logout");
// // //         break;
// // //       default:
// // //         console.log("Default");
// // //         handleCloseUserMenu();
// // //     }
// // //   };

// // //   return (
// // //     <AppBar position="static">
// // //       <Container maxWidth="xl">
// // //         <Toolbar disableGutters>
// // //           <HowToVoteIcon sx={{ mr: 1 }} />
// // //           <Typography
// // //             variant="h5"
// // //             noWrap
// // //             component="a"
// // //             href=""
// // //             sx={{
// // //               mr: 2,
// // //               flexGrow: 1,
// // //               fontFamily: "monospace",
// // //               fontWeight: 700,
// // //               letterSpacing: ".3rem",
// // //               color: "inherit",
// // //               textDecoration: "none",
// // //             }}
// // //           >
// // //             Voting System
// // //           </Typography>

// // //           <Box sx={{ flexGrow: 0 }}>
// // //             <Tooltip title="Open settings">
// // //               <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
// // //                 <Avatar alt="Remy Sharp" src="url" />
// // //               </IconButton>
// // //             </Tooltip>
// // //             <Menu
// // //               sx={{ mt: "45px" }}
// // //               id="menu-appbar"
// // //               anchorEl={anchorElUser}
// // //               anchorOrigin={{
// // //                 vertical: "top",
// // //                 horizontal: "right",
// // //               }}
// // //               keepMounted
// // //               transformOrigin={{
// // //                 vertical: "top",
// // //                 horizontal: "right",
// // //               }}
// // //               open={Boolean(anchorElUser)}
// // //               onClose={handleCloseUserMenu}
// // //             >
// // //               {settings.map((setting) => (
// // //                 <MenuItem key={setting} onClick={handleSetting}>
// // //                   <Typography textAlign="center">{setting}</Typography>
// // //                 </MenuItem>
// // //               ))}
// // //             </Menu>
// // //           </Box>
// // //         </Toolbar>
// // //       </Container>
// // //     </AppBar>
// // //   );
// // // };
// // // export default Navbar;
// // import { useEffect, useState } from "react";
// // import AppBar from "@mui/material/AppBar";
// // import Toolbar from "@mui/material/Toolbar";
// // import Typography from "@mui/material/Typography";
// // import Button from "@mui/material/Button";
// // import Box from "@mui/material/Box";

// // export default function Navbar({ web3, account, shardIndex, onDisconnect }) {
// //   const [shortAddress, setShortAddress] = useState("");

// //   useEffect(() => {
// //     if (account) {
// //       setShortAddress(`${account.substring(0, 6)}...${account.substring(account.length - 4)}`);
// //     }
// //   }, [account]);

// //   return (
// //     <AppBar position="static" sx={{ mb: 2 }}>
// //       <Toolbar>
// //         <Typography variant="h6" sx={{ flexGrow: 1 }}>
// //           Voting DApp
// //         </Typography>

// //         {account ? (
// //           <Box sx={{ display: "flex", alignItems: "center" }}>
// //             <Typography variant="body1" sx={{ mr: 2 }}>
// //               Connected: {shortAddress}
// //             </Typography>
// //             {shardIndex !== null && (
// //               <Typography variant="body1" sx={{ mr: 2 }}>
// //                 Shard: {shardIndex}
// //               </Typography>
// //             )}
// //             <Button variant="contained" color="secondary" onClick={onDisconnect}>
// //               Disconnect
// //             </Button>
// //           </Box>
// //         ) : (
// //           <Typography variant="body1">Not Connected</Typography>
// //         )}
// //       </Toolbar>
// //     </AppBar>
// //   );
// // }
// import React from 'react';
// import { Link } from 'react-router-dom';
// import './Navbar.css';

// function Navbar({ account }) {
//   return (
//     <nav className="navbar">
//       <div className="navbar-brand">
//         <Link to="/">Blockchain Voting System</Link>
//       </div>
//       <ul className="navbar-nav">
//         <li className="nav-item">
//           <Link to="/" className="nav-link">Home</Link>
//         </li>
//         <li className="nav-item">
//           <Link to="/regions" className="nav-link">Vote</Link>
//         </li>
//         <li className="nav-item">
//           <Link to="/results" className="nav-link">Results</Link>
//         </li>
//       </ul>
//       <div className="account-info">
//         {account ? (
//           <div className="account-address">
//             Connected: {account.substring(0, 6)}...{account.substring(account.length - 4)}
//           </div>
//         ) : (
//           <div className="account-address">Not connected</div>
//         )}
//       </div>
//     </nav>
//   );
// }

// export default Navbar;
import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import HowToVoteIcon from '@mui/icons-material/HowToVote';

function Navbar({ account, userRole }) {
  // Truncate the account address for display
  const displayAddress = account ?
    `${account.substring(0, 6)}...${account.substring(account.length - 4)}` :
    'Not Connected';

  return (
    <AppBar position="static">
      <Toolbar>
        <HowToVoteIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          Sharded Voting System
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" component={Link} to="/regions">
            Regions
          </Button>

          <Button color="inherit" component={Link} to="/results">
            Results
          </Button>


          {account && account === '0x657d2dc615964428DE107c53E44Ae79D41fC4249' && (
            <Button color="inherit" component={Link} to="/admin">
              Admin
            </Button>
          )}



          <Chip
            label={displayAddress}
            color="secondary"
            size="small"
            sx={{ ml: 2 }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
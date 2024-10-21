import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

const Headers = () => {
    const usertoken = localStorage.getItem("userlogintoken");
    const admintoken = localStorage.getItem("adminlogintoken");
    const [open, setOpen] = useState(false); // Start with the menu closed

    const navigate = useNavigate();

    const handleOpen = () => {
        setOpen(!open);
    };

    return (
        <div>
            <Box sx={{ flexGrow: 1 }} className="head" style={{background:"antiquewhite"}}>
                <AppBar position="static">
                    <Toolbar variant="regular">
                        <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleOpen} sx={{ mr: 2 }}>
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" color="inherit" component="div">
                            <Link to="/" className="links" style={{ color: 'inherit', textDecoration: 'none' }}>
                                CableGuy
                            </Link>
                        </Typography>
                    </Toolbar>
                </AppBar>
            </Box>
            <header className={open ? "open" : "closes"}>
                <ul>
                    <li><Link className="links" to="/">Home</Link></li>
                    {usertoken ? (
                        <li>
                            <Link className="links" to="/" onClick={() => {
                                localStorage.removeItem("userlogintoken");
                                navigate("/userlogin");
                            }}>Logout</Link>
                        </li>
                    ) : (
                        admintoken ? null : <li><Link className="links" to="/userlogin">Login</Link></li>
                    )}
                    {admintoken ? (
                        <li>
                            <Link className="links" to="/" onClick={() => {
                                localStorage.removeItem("adminlogintoken");
                                navigate("/adminlogin");
                            }}>Logout</Link>
                        </li>
                    ) : usertoken ? null : <li><Link className="links" to="/adminlogin">Admin Login</Link></li>}
                </ul>
            </header>
        </div>
    );
};

export default Headers;

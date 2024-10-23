import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Drawer, Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import InboxIcon from '@mui/icons-material/Inbox';
import MailIcon from '@mui/icons-material/Mail';
import { jwtDecode } from 'jwt-decode';


const Header = () => {
    const navigate = useNavigate();
    const usertoken = localStorage.getItem("userlogintoken");
    const admintoken = localStorage.getItem("adminlogintoken");
    const [open, setOpen] = useState(false);

    let id = "";
    if (usertoken) {
        const decoded = jwtDecode(usertoken);
        id = decoded.userId
    }

    else if (admintoken) {
        const decoded = jwtDecode(admintoken);
        id = decoded.adminId;
    }

    const toggleDrawer = (isOpen) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setOpen(isOpen);
    };

    const handleUserLogout = () => {
        localStorage.removeItem("userlogintoken");
        navigate("/userlogin");
    };

    const handleAdminLogout = () => {
        localStorage.removeItem("adminlogintoken");
        navigate("/adminlogin");
    };

    const DrawerList = (
        // <div style={{background:"aliceblue",marginTop:"0px",zIndex:"300",position:"sticky",top:"",left:"0"}} >
        <Box sx={{ width: 180 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
            <List>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemText primary={<Link className="linkss" to="/">Home</Link>} />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemText primary={<Link to="/about" className="linkss">About</Link>} />
                    </ListItemButton>
                </ListItem>
                {usertoken ? (
                    <>
                    <div style={{marginLeft:"23px"}}>
                        <ListItem disablePadding  style={{textAlign:"center"}}>
                            <ListItemButton  onClick={handleUserLogout}>
                                <ListItemText primary="Logout"/>
                            </ListItemButton>
                        </ListItem>
                        </div>
                        <div>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemText primary={<Link to={`/userdashboard/${id}`} className="linkss">Dashboard</Link>} />
                            </ListItemButton>
                        </ListItem>
                        </div>
                    </>
                ) : (
                    !admintoken && (
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemText primary={<Link className="linkss" to="/userlogin">Login</Link>} />
                            </ListItemButton>
                        </ListItem>
                    )
                )}
                {admintoken ? (
                    <>
                      <div style={{marginLeft:"23px"}}>
                      <ListItem disablePadding>
                            <ListItemButton onClick={handleAdminLogout}>
                                <ListItemText primary="Logout" />
                            </ListItemButton>
                        </ListItem>
                      </div>
                       <div>
                       <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemText primary={<Link to={`/admindashboard/${id}`} className="linkss">Dashboard</Link>} />
                            </ListItemButton>
                        </ListItem>
                       </div>
                    </>
                ) : (
                    !usertoken && (
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemText primary={<Link className="linkss" to="/adminlogin">Admin Login</Link>} />
                            </ListItemButton>
                        </ListItem>
                    )
                )}
            </List>
            <Divider />
        </Box>
        // </div>
    );

    return (
        <div>
            <header>
                <ul>
                    <li><Link className="links" to="/">Home</Link></li>
                    <li><Link to="/about" className="links">About</Link></li>
                    {usertoken ? (
                        <li><Link className="links" to="/" onClick={handleUserLogout}>Logout</Link></li>
                    ) : (
                        !admintoken && <li><Link className="links" to="/userlogin">Login</Link></li>
                    )}
                    {admintoken ? (
                        <li><Link className="links" style={{ marginLeft: "5px" }} to="/" onClick={handleAdminLogout}>Logout</Link></li>
                    ) : (
                        !usertoken && <li><Link className="links" to="/adminlogin">Admin Login</Link></li>
                    )}
                </ul>
            </header>

            {/* Button to open drawer */}
            <Button onClick={toggleDrawer(true)}>
                <MenuIcon />
            </Button>
            {/* Drawer Component */}
            <Drawer open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
        </div>
    );
};

export default Header;

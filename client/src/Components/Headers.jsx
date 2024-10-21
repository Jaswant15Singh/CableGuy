import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";

const Headers = () => {
    const usertoken = localStorage.getItem("userlogintoken");
    const admintoken = localStorage.getItem("adminlogintoken");
    const [adminreg, setAdminreg] = useState(true);
    const [open, setOpen] = useState(false)

    const navigate = useNavigate();
    const handleOpen = (e) => {
        setOpen(!open)
    }
    return (
        <div>

            <header  className={open ? "open" : "closes"}>
                <h1><Link to="/" className='links'>CableGuy</Link></h1>

                {/* <button className='O'>O</button> */}
                {/* <ul  className={`${open}?"open":"close"`}> */}
                <ul>

                    <li><Link className={`links`} to='/'>Home</Link></li>
                    {usertoken ? (
                        <li>
                            <Link className='links' to='/' onClick={() => {
                                localStorage.removeItem("userlogintoken");
                                navigate("/userlogin");
                            }}>Logout</Link>
                        </li>
                    ) : (
                        admintoken ? "" : <li><Link className='links' to='/userlogin'>Login</Link></li>

                    )}
                    {admintoken ? (

                        <li>
                            <Link className='links' to='/' onClick={() => {
                                localStorage.removeItem("adminlogintoken");
                                navigate("/adminlogin");
                            }}>Logout</Link>
                        </li>

                    ) : usertoken ? "" : <li><Link className='links' to='/adminlogin'>Admin Login</Link></li>
                    }
                </ul>


            </header>
            {/* <button style={{zIndex:"300"}} id='X' onClick={handleOpen}>Menu</button> */}

        </div>
    );
}

export default Headers;

import { jwtDecode } from 'jwt-decode';
import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
    const token = localStorage.getItem("userlogintoken") ;
    const admintoken= localStorage.getItem("adminlogintoken");
let id="";
    if(token){
        const decoded=jwtDecode(token);
    id=decoded.userId
    }

    else if(admintoken){
        const decoded=jwtDecode(admintoken);
        id=decoded.adminId;
    }

    return (
       
            <div className='home'>
                <div className='homeimage'>
                    <img src="https://www.seidenstern.at/wp-content/uploads/2021/10/About-Us-31.jpg" alt="" />
                    <div className='homedesc'>
                        <h1>Welcome To CableGuy Catv</h1>
                        {token && <Link className="homelink links" to={`/userdashboard/${id}`}>Dashboard</Link>}
                        {admintoken && <Link className='homelink links' to={`/admindashboard/${id}`}>Dashboard</Link>}
                    </div>
                </div>

            </div>
     
    )
}

export default Home

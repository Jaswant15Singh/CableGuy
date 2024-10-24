import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const Userlogin = () => {
    const [islogin, setIslogin] = useState(true);
    const [data, setData] = useState({ name: "", email: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }
    useEffect(()=>{
        window.document.title="User Login"
    },[])

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        
        let res = await fetch("https://cableguyy.onrender.com/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: data.email, password: data.password })
        });

        if (!res.ok) {
            alert("Some issue occured")
        }

        res = await res.json();
        if (!res.success) {
            alert(res.message)
        }

        else {
            // console.log(res.token);
            const decoded = jwtDecode(res.token);
            console.log(decoded);
            
            localStorage.setItem("userlogintoken", res.token)
            alert(res.message);
            setData({ email: "", password: "" });
            setIslogin(true);
            navigate(`/userdashboard/${decoded.userId}`)
        }
    }

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        let resp = await fetch("http://localhost:5000/api/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        if (!resp.ok) {
            alert("Some issue occured")
        }

        resp = await resp.json();
        console.log(resp);

        if (!resp.success) {
            alert(resp.message);

        }
        else {
            alert(resp.message);
            setData({ name: "", email: "", password: "" });


        }
    }
    return (
        <div>
            {islogin === true ?
                <div className="login">
                    <form onSubmit={handleLoginSubmit}>
                        <h1>Login</h1>
                        <div className='inp'>
                            <label htmlFor="email">Email</label>
                            <input type="email" name="email" id="" required={true} value={data.email} onChange={handleChange} placeholder='Email' />
                        </div>
                        <div className='inp'>
                            <label htmlFor="password">Password</label>
                            <input type="password" name="password" id="" required={true} value={data.password} onChange={handleChange} placeholder='Password' />
                        </div>
                        <button type='submit' className='btn'>Log In</button>
                        <h3 className='signup'>Not yet Registered? <span onClick={() => { setIslogin(false) }}>Sign Up</span></h3>

                    </form>
                </div> :
                <div className='signup' style={{backgroundColor: "#D8E3DB"}}>
                    <form onSubmit={handleSignupSubmit}>
                        <h1>Signup</h1>
                        <div className='inp'>
                            <label htmlFor="name">Name</label>
                            <input type="text" name="name" id="" required={true} value={data.name} onChange={handleChange} placeholder='Name' />
                        </div>
                        <div className='inp'>
                            <label htmlFor="email">Email</label>
                            <input type="email" name="email" id="" required={true} value={data.email} onChange={handleChange} placeholder='Email' />
                        </div>
                        <div className='inp'>
                            <label htmlFor="password">Password</label>
                            <input type="password" name="password" id="" required={true} value={data.password} onChange={handleChange} placeholder='Passowrd' />
                        </div>
                        <button type='submit' className='btn'>Sign Up</button>
                        <h3 className='signup'>Not yet Registered? <span onClick={() => { setIslogin(true) }}>Sign Up</span></h3>

                    </form>
                </div>}
        </div>
    )
}

export default Userlogin

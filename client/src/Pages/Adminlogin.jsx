import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { toast } from 'react-toastify';

const Adminlogin = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    console.log(122);

    let res = await fetch("http://localhost:5000/adminapi/loginadmin", {
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
    console.log(res);


    if (res.success) {
      console.log(res.token);
      const decoded = jwtDecode(res.token);
      console.log(decoded);
      if (decoded.role === "admin") {
        localStorage.setItem("adminlogintoken", res.token);
        toast.success(res.message);
        setData({ email: "", password: "" });


        navigate(`/admindashboard/${decoded.adminId}`)
      }
    }
    if (!res.success) {
      toast.error(res.message)
    }




  }

  return (

    <div className="login">
      <form onSubmit={handleLoginSubmit}>
        <h1>Admin Login</h1>
        <div className='inp'>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="" required={true} value={data.email} onChange={handleChange} placeholder='Email' />
        </div>
        <div className='inp'>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="" required={true} value={data.password} onChange={handleChange} placeholder='Password' />
        </div>
        <button type='submit' className='btn'>Log In</button>

      </form>
    </div>
  )
}

export default Adminlogin

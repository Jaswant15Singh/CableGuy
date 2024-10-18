import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const IndUsers = () => {
    const [data, setData] = useState({ name: "", email: "" });
    const [updatedata, setUpdatedata] = useState({ name: "", email: "" });
    const { id } = useParams();
    const token = localStorage.getItem("adminlogintoken");
    const decoded = jwtDecode(token);
    // console.log(decoded);
    const adminidd = decoded.adminId;
    console.log(adminidd);


    useEffect(() => {
        if (token) {
            getSingleUser();
        } else {
            alert("No authorization token found.");
        }
    }, [token]);

    const getSingleUser = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/users/${id}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const result = await res.json();
            if (!result.success) {
                alert(result.message);
                return;
            }

            setData({ name: result.data.name, email: result.data.email });
            setUpdatedata({ name: result.data.name, email: result.data.email }); // Initialize updatedata as well
        } catch (error) {
            alert("Error fetching user data: " + error.message);
        }
    };

    const handleChange = (e) => {
        setUpdatedata({ ...updatedata, [e.target.name]: e.target.value });
    };

    const handleUpdateClick = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:5000/api/users/update/${id}`, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedata) // Send the updated data directly
            });

            if (!res.ok) {
                throw new Error("Some issue occurred while updating.");
            }

            const result = await res.json();
            setData(updatedata); // Update data with the new values
            alert("Updated Successfully");
        } catch (error) {
            alert("Error updating user: " + error.message);
        }
    };

    return (
        <div className='ind'>
            <form onSubmit={handleUpdateClick}>
                <div className='indinp'>
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={updatedata.name}
                        onChange={handleChange}
                    />
                </div>
                <div className='indinp'>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={updatedata.email}
                        onChange={handleChange}
                    />
                </div>
                <button type='submit' className='links'>Update form</button>
            </form>
            <Link to={`/admindashboard/${adminidd}`}>Back</Link>
        </div>
    );
}

export default IndUsers;

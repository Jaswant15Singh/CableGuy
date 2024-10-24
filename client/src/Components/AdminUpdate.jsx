import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

const AdminUpdate = () => {
    const { id } = useParams();
    console.log(id);
    
    const token = localStorage.getItem("adminlogintoken");
    const [data, setData] = useState({ name: "", email: "" });
    const navigate = useNavigate(); 
    useEffect(()=>{
        window.document.title="Admin Update"
    },[])

    useEffect(() => {
        const getSingleUser = async () => {
            let res = await fetch(`http://localhost:5000/adminapi/admin/${id}`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            if (!res.ok) {
                alert('Some issue occurred');
                return;
            }

            res = await res.json();
            // console.log(res);
            setData({ name: res.name, email: res.email });
        };

        getSingleUser();
    }, [id, token]);

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        let res = await fetch(`http://localhost:5000/adminapi/admin/update/${id}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            alert("Some issue occurred");
            return;
        }

        res = await res.json();
        if (!res.success) {
            alert(res.message);
        } else {
            alert(res.message);
            navigate(`/admindashboard/${id}`);
        }
    };

    return (
        <div>
            <div className="login">
                <form onSubmit={handleUpdateSubmit}>
                    <h1>Update User</h1>
                    <Link className='linkss' style={{ margin: "10px auto" }} to={`/admindashboard/${id}`}>Back</Link>

                    <div className='inp'>
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            name="name"
                            required={true}
                            value={data.name}
                            onChange={handleChange}
                            placeholder='Name'
                        />
                    </div>
                    <div className='inp'>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            name="email"
                            required={true}
                            value={data.email}
                            onChange={handleChange}
                            placeholder='Email'
                        />
                    </div>

                    <button style={{ marginTop: "0px" }} type='submit' className='btn'>Update</button>
                </form>
            </div>
        </div>
    );
};

export default AdminUpdate;

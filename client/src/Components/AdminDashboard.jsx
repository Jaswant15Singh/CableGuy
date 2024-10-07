import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'

const AdminDashboard = () => {
    const [data, setData] = useState([]);
    const [inp, setInp] = useState({ name: "", email: "", password: "" });
    const [inpp, setInpp] = useState({ name: "", contact: "", address: "" });
    const [prod, setProd] = useState({ name: "", description: "", category: "", price: "", supp_id: "" })
    const [dataa, setDataa] = useState([]);
    const [prodData, setProdData] = useState([]);


    const { adminid } = useParams();
    // console.log(adminid);

    const token = localStorage.getItem("adminlogintoken");
    const [adminreg, setAdminreg] = useState(false);
    const [supplieradd, setSupplieradd] = useState(false);
    const [prodadd, setProdadd] = useState(false);
    const [supplierlist, setSupplierlist] = useState([]);

    const handleChange = (e) => {
        setInp({ ...inp, [e.target.name]: e.target.value })
    }
    const handleeChange = (e) => {
        setInpp({ ...inpp, [e.target.name]: e.target.value })
    }
    const handleProdChange = (e) => {
        setProd({ ...prod, [e.target.name]: e.target.value })
    }

    useEffect(() => {
        getSingleUser();
        getAllSuppliers();

    }, []);
    const getSingleUser = async () => {
        let res = await fetch(`http://localhost:5000/api/users/`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        if (!res.ok) {
            alert('Some issue occured');
        }

        res = await res.json();
        console.log(res);
        setDataa(res);

    }

    const getAllSuppliers = async () => {
        let res = await fetch(`http://localhost:5000/adminapi/supplier`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        if (!res.ok) {
            alert('Some issue occured');
        }

        res = await res.json();
        setSupplierlist(res.data);
    }


    useEffect(() => {
        getAllAdmin();
    }, [adminreg])

    const getAllAdmin = async () => {
        let res = await fetch(`http://localhost:5000/adminapi/admin/`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        if (!res.ok) {
            alert('Some issue occured');
        }

        res = await res.json();
        setData(res);

    }

    const addAdmin = async (e) => {
        e.preventDefault();
        let res = await fetch("http://localhost:5000/adminapi/signupadmin", {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: inp.name, email: inp.email, password: inp.password })
        });

        if (!res.ok) {
            alert("Some issue occured")
        }

        res = await res.json();
        console.log(res);
        if (!res.success) {
            alert(res.message)
        }
        alert(res.message);
        setInp({ name: "", email: "", password: "" })

        setAdminreg(!addAdmin);
        getAllAdmin();
    }

    const handleDelete = async (idd) => {
        let res = await fetch(`http://localhost:5000/adminapi/admin/delete/${idd}`, {
            method: "Delete",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });


        if (!res.ok) {
            alert("Some issue occred");
        }


        res = await res.json();
        console.log(res);

        if (!res.success) {
            alert(res.message)
        }

        else {
            alert(res.message);
            getAllAdmin();

        }



    }

    const handleUserDelete = async (userid) => {
        let res = await fetch(`http://localhost:5000/api/delete/${userid}`, {
            method: "DELETE",

            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (!res.ok) {
            alert("Some issue occured");
        }

        res = await res.json();
        console.log(res);

        if (!res.success) {
            alert(res.message);
        }

        alert(res.message);
        getSingleUser();
    }

    const addSupplier = async (e) => {
        e.preventDefault();
        let res = await fetch("http://localhost:5000/adminapi/supplier/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(inpp)
        });

        if (!res.ok) {
            alert("Some issue occured")
        }

        res = await res.json();
        console.log(res);
        if (!res.success) {
            alert(res.message)
        }
        alert(res.message);
        setInpp({ name: "", email: "", password: "" })

        setSupplieradd(!supplieradd);

    }

    const addProduct = async (e) => {
        e.preventDefault();
        let res = await fetch("http://localhost:5000/adminapi/product/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: prod.name, description: prod.description, category: prod.category, price: Number(prod.price), supp_id: Number(prod.supp_id) })
        });

        if (!res.ok) {
            alert("Some issue occured")
        }

        res = await res.json();
        console.log(res);
        if (!res.success) {
            alert(res.message)
        }
        alert(res.message);
        setProd({ name: "", description: "", category: "", price: "", supp_id: "" })

        setProdadd(!prodadd);
    }

    return (
        <div className='admindashboard'>
            <div className="tables">
                <table className='admintable' border={2}>
                    <thead>
                        <tr>
                            <th>Role</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Update/Delete</th>
                        </tr>

                    </thead>
                    <tbody>
                        {
                            data.map((e) => {
                                return (
                                    <tr key={e.id}>
                                        <td>Admin</td>
                                        <td>{e.name}</td>
                                        <td>{e.email}</td>
                                        <td style={{ gap: "2px" }}>
                                            <Link className='links' to={`/admin/update/${e.id}`} >Update</Link>
                                            <button onClick={() => { handleDelete(e.id) }} className='links'>Delete</button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
                <table className='userstable' border={2}>
                    <thead>
                        <tr>
                            <th>Role</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Update/Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            dataa.map((e) => {
                                return (
                                    <tr>
                                        <td>User</td>
                                        <td>{e.name}</td>
                                        <td>{e.email}</td>
                                        <td>
                                            <Link className='links' to={`/admin/ind/${e.id}`}>Update</Link>
                                            <button className='links' onClick={() => { handleUserDelete(e.id) }}>Delete</button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>

            </div>
            <div className='tables' style={{ width: "50%" }}>
                <table className='userstable' border={2}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Contact</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            supplierlist.map((e) => {
                                return (
                                    <tr>
                                        <td>{e.name}</td>
                                        <td>{e.contact}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
            <button className='newad links' onClick={() => { setAdminreg(!adminreg) }}>Add new admin</button>
            {
                adminreg ? <div className='admreg'><form onSubmit={addAdmin}>
                    <button className='close' onClick={() => { setAdminreg(!adminreg) }}>X</button>
                    <div className='adminp'>
                        <label htmlFor="name">Name</label>
                        <input type="text" name="name" id="" value={inp.name} required={true} onChange={handleChange} />
                    </div>
                    <div className='adminp'>
                        <label htmlFor="email">Email</label>
                        <input type="text" name="email" id="" value={inp.email} required={true} onChange={handleChange} />
                    </div>
                    <div className='adminp'>
                        <label htmlFor="password">Password</label>
                        <input type="text" name="password" id="" value={inp.password} required={true} onChange={handleChange} />
                    </div>
                    <button type='submit'>Add</button>
                </form> </div> : ""
            }

            <button className='newad links' style={{ marginTop: "80px" }} onClick={() => { setSupplieradd(!supplieradd) }}>Add new supplier</button>
            {
                supplieradd ? <div className='admreg'><form onSubmit={addSupplier}>
                    <button className='close' onClick={() => { setSupplieradd(!supplieradd) }}>X</button>
                    <div className='adminp'>
                        <label htmlFor="name">Name</label>
                        <input type="text" name="name" id="" value={inpp.name} required={true} onChange={handleeChange} />
                    </div>
                    <div className='adminp'>
                        <label htmlFor="email">Contact</label>
                        <input type="text" name="contact" id="" value={inpp.contact} required={true} onChange={handleeChange} />
                    </div>
                    <div className='adminp'>
                        <label htmlFor="password">Address</label>
                        <input type="text" name="address" id="" value={inpp.address} required={true} onChange={handleeChange} />
                    </div>
                    <button type='submit'>Add</button>
                </form> </div> : ""
            }

            <button className='newad links' style={{ marginTop: "150px" }} onClick={() => { setProdadd(!prodadd) }}>Add new product</button>
            {
                prodadd ? <div className='admreg'><form onSubmit={addProduct}>
                    <button className='close' onClick={() => { setProdadd(!prodadd) }}>X</button>
                    <div className='adminp'>
                        <label htmlFor="name">Name</label>
                        <input type="text" name="name" id="" value={prod.name} required={true} onChange={handleProdChange} />
                    </div>
                    <div className='adminp'>
                        <label htmlFor="email">Description</label>
                        <input type="text" name="description" id="" value={prod.description} required={true} onChange={handleProdChange} />
                    </div>
                    <div className='adminp'>
                        <label htmlFor="password">Category</label>
                        <input type="text" name="category" id="" value={prod.category} required={true} onChange={handleProdChange} />
                    </div>
                    <div className='adminp'>
                        <label htmlFor="password">Price</label>
                        <input type="text" name="price" id="" value={prod.price} required={true} onChange={handleProdChange} />
                    </div>
                    <div className='adminp'>
                        <label htmlFor="password">Supplier's Id</label>
                        <input type="text" name="supp_id" id="" value={prod.supp_id} required={true} onChange={handleProdChange} />
                    </div>
                    <button type='submit'>Add</button>
                </form> </div> : ""
            }
        </div>
    )
}

export default AdminDashboard

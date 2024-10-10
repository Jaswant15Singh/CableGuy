import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'

const AdminDashboard = () => {
    const [data, setData] = useState([]);
    const [inp, setInp] = useState({ name: "", email: "", password: "" });
    const [inpp, setInpp] = useState({ name: "", contact: "", address: "" });
    const [prod, setProd] = useState([{ name: "", description: "", category: "", price: "", supp_id: "" }])
    const [dataa, setDataa] = useState([]);
    const [supplierId, setSupplierId] = useState("")
    const [prodData, setProdData] = useState([]);
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([])


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
    // const handleProdChange = (e) => {
    //     const { name, value } = e.target;

    //     setProd(prevState => ({
    //         ...prevState,
    //         [name]: value
    //     }));
    // };

    const category = [{ id: 1, name: "Vegetable" }, { id: 2, name: "Fruit" }, { id: 3, name: "Gaming" }, { id: 4, name: "Study" }]

    const handleProdChange = (e, index) => {
        const { name, value } = e.target;
        const updatedProducts = [...prod];
        updatedProducts[index] = {
            ...updatedProducts[index],
            [name]: value,
        };
        setProd(updatedProducts);
    };

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
    const addMoreProducts = () => {
        const hasEmptyFields = prod.some((product) =>
            !product.name || !product.description || !product.category || !product.price || !product.batch_quantity
        );
        console.log(hasEmptyFields);


        if (hasEmptyFields) {
            alert("Enter previous records first");
            return; // Stop the function execution if fields are empty
        }
        setCart([...cart, ...prod])
        setProd([{ name: '', description: '', category: '', price: '', batch_quantity: '' }]);

    }
    const removeProduct = (index) => {
        const updatedProducts = cart.filter((_, i) => i !== index);
        setCart(updatedProducts);
    }
    const addProduct = async (e) => {

        // const requestData = {
        //     name: prod.name,
        //     description: prod.description,
        //     category: prod.category,
        //     price: Number(prod.price), 
        //     supp_id: Number(prod.supp_id),  
        //     batch_quantity: Number(prod.batch_quantity),  
        //     manufactured: prod.manufactured  
        // };


        //    setProducts = [
        //     prod.name,
        //     prod.description,
        //     prod.category,
        //     Number(prod.price),
        //     Number(prod.batch_quantity),
        //     prod.manufactured
        // ];
        // const supp_id=Number(prod.supp_id);
        // const combine={
        //     supp_id,
        //     products
        // }

        if (cart.length < 1) {
            alert("No orders placed");
            return;
        }
        const products = cart.map((product) => ({
            name: product.name,
            description: product.description,
            category: product.category,
            price: Number(product.price),
            batch_quantity: Number(product.batch_quantity),
        }));
        console.log(products);

        const requestData = {
            supp_id: Number(supplierId),
            products: products,
        };
        try {
            let res = await fetch("http://localhost:5000/adminapi/cr", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestData)
            });

            if (!res.ok) {
                const errorMessage = await res.json();
                alert(errorMessage.message || 'Some issue occurred');
                return;
            }

            const responseData = await res.json();

            if (!responseData.success) {
                alert(responseData.message || 'Some issue occurred');
                return;
            }

            alert(responseData.message);

            // setProd({
            //     name: "",
            //     description: "",
            //     category: "",
            //     price: "",
            //     supp_id: "",
            //     batch_quantity: "",
            //     manufactured: ""
            // });
            setCart([])

            setProdadd(!prodadd); // Assuming this toggles a state variable for UI update
        } catch (error) {
            console.error("Error while adding product:", error);
            alert("Failed to add product");
        }
    };



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
            {/* {
                prodadd ? (
                    <div className='admreg'>
                        <form onSubmit={addProduct}>
                            <button className='close' onClick={() => { setProdadd(!prodadd) }}>X</button>
                            <div className='adminp'>
                                <label htmlFor="name">Product Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={prod.name}
                                    required={true}
                                    onChange={handleProdChange}
                                />
                            </div>
                            <div className='adminp'>
                                <label htmlFor="description">Description</label>
                                <input
                                    type="text"
                                    name="description"
                                    value={prod.description}
                                    required={true}
                                    onChange={handleProdChange}
                                />
                            </div>
                            <div className='adminp'>
                                <label htmlFor="category">Category</label>
                                <input
                                    type="text"
                                    name="category"
                                    value={prod.category}
                                    required={true}
                                    onChange={handleProdChange}
                                />
                            </div>
                            <div className='adminp'>
                                <label htmlFor="price">Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={prod.price}
                                    required={true}
                                    onChange={handleProdChange}
                                />
                            </div>
                            <div className='adminp'>
                                <label htmlFor="supplier">Supplier</label>
                                <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)} required>
                                    <option value="">Select Supplier</option>
                                    {supplierlist.map((supplier) => (
                                        <option key={supplier.id} value={supplier.id}>
                                            {supplier.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button type='submit'>Add Product</button>
                        </form>
                    </div>
                ) : ""
            } */}

            {prodadd ? (
                <div className="admreg" style={{ minHeight: "80vh" }}>
                    <form >
                        <button
                            className="close"
                            onClick={() => {
                                setProdadd(!prodadd);
                            }}
                        >
                            X
                        </button>

                        <div className="adminp">
                            <label htmlFor="supplier">Supplier ID</label>
                            <select
                                value={supplierId}
                                onChange={(e) => setSupplierId(e.target.value)}
                                required
                            >
                                <option value="">Select Supplier</option>
                                {supplierlist.map((supplier) => (
                                    <option key={supplier.id} value={supplier.id}>
                                        {supplier.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {prod.map((product, index) => (
                            <div key={index}>
                                <div className="adminp">
                                    <label htmlFor="name">Product Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={product.name}
                                        onChange={(e) => handleProdChange(e, index)}
                                        required
                                    />
                                </div>

                                <div className="adminp">
                                    <label htmlFor="description">Description</label>
                                    <input
                                        type="text"
                                        name="description"
                                        value={product.description}
                                        onChange={(e) => handleProdChange(e, index)}
                                        required
                                    />
                                </div>

                                <div className="adminp">
                                    <label htmlFor="category">Category</label>
                                    {/* <input
                                        type="text"
                                        name="category"
                                        value={product.category}
                                        onChange={(e) => handleProdChange(e, index)}
                                        required
                                    /> */}
                                    <select name="category" id="" onChange={(e) => handleProdChange(e, index)}>
                                        <option value="">Select Category</option>
                                        {category.map((cat) => (
                                            <option value={cat.name}>{cat.name}</option>
                                        ))}
                                    </select>

                                </div>

                                <div className="adminp">
                                    <label htmlFor="price">Price</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={product.price}
                                        onChange={(e) => handleProdChange(e, index)}
                                        required
                                    />
                                </div>

                                <div className="adminp">
                                    <label htmlFor="batch_quantity">Batch Quantity</label>
                                    <input
                                        type="number"
                                        name="batch_quantity"
                                        value={product.batch_quantity}
                                        onChange={(e) => handleProdChange(e, index)}
                                        required
                                    />
                                </div>

                                {prod.length > 1 && (
                                    <button type="button" onClick={() => removeProduct(index)}>
                                        Remove Product
                                    </button>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={addMoreProducts}>
                            Add More Products
                        </button>

                    </form>
                </div>
            ) : (
                ""
            )}

            <table className='admintable' style={{ width: "50%", margin: "0 auto" }} border={2}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Remove</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        cart.map((e, index) => {
                            return (
                                <tr key={e.id}>
                                    <td>{e.name}</td>
                                    <td>{e.description}</td>
                                    <td>{e.category}</td>
                                    <td>{e.price}</td>
                                    <td>{e.batch_quantity}</td>
                                    <td><button onClick={() => { removeProduct(index) }}>Remove</button></td>
                                </tr>
                            )
                        })

                    }

                </tbody>
            </table>



            <button style={{ width: "60px", margin: "10px auto", display: "block" }} onClick={addProduct}>Submit Products</button>
        </div>
    )
}

export default AdminDashboard

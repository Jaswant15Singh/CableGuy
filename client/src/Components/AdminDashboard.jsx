import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'

const AdminDashboard = () => {
    const [data, setData] = useState([]);
    const [inp, setInp] = useState({ name: "", email: "", password: "" });
    const [inpp, setInpp] = useState({ name: "", contact: "", address: "" });
    const [prod, setProd] = useState([{ name: "", prod_desc: "", description: "", category: "", price: "", supp_id: "" }]);
    const [indProd, setIndProd] = useState({ name: "", description: "", category: "" })
    const [dataa, setDataa] = useState([]);
    const [supplierId, setSupplierId] = useState("")
    const [prodData, setProdData] = useState([]);
    const [products, setProducts] = useState([]);
    const [isProd, setIsProd] = useState(false);
    const [getProd, setGetProd] = useState([]);
    const [isallProd, setIsallProd] = useState(false);
    const [getallProd, setGetAllProd] = useState([])

    const [cart, setCart] = useState([]);
    const [individualProduct, setIndividualProduct] = useState([]);
    const [isIndividual, setIsIndividual] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [currentPageBatch, setCurrentPageBatch] = useState(1);
    const itemsPerPageBatch = 5;


    const { adminid } = useParams();
    console.log(adminid);
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

    const handleIndProdChange = (e) => {
        setIndProd({ ...indProd, [e.target.name]: e.target.value })
    }

    const handleCategoryChange = (e, index) => {
        const updatedProd = [...prod];
        updatedProd[index].category = e.target.value;
        setProd(updatedProd);
        setSelectedCategory(e.target.value);
    };

    useEffect(() => {
        getSingleUser();
        getAllSuppliers();
        getIndividualProducts();
        getProducts();
        getAllProducts()

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
        // console.log(res);
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

    const getIndividualProducts = async () => {
        let res = await fetch("http://localhost:5000/adminapi/indproducts", {
            method: "GET",

            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        if (!res.ok) {
            alert("Some issue occured while fetching individual datas")
        }
        res = await res.json();
        // console.log(res.data);
        setIndividualProduct(res.data);
    }
    useEffect(() => {
        getAllAdmin();
    }, [adminreg])

    const getProducts = async () => {
        let res = await fetch("http://localhost:5000/adminapi//product/batch", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (!res.ok) {
            alert("Some issue occured in fetchinf products")
        }

        res = await res.json();
        console.log(res.message);

        if (res.success) {
            setGetProd(res.message)
        }

        else {
            alert(res.message)
        }
    }

    const getAllProducts = async () => {
        let res = await fetch("http://localhost:5000/adminapi/products", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (!res.ok) {
            alert("Some issue occured in fetching products")
        }

        res = await res.json();
        console.log(res.data);

        if (res.success) {
            setGetAllProd(res.data)
        }

        else {
            alert(res.message)
        }
    }

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
                'Authorization': `Bearer ${token}`,
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

    const addIndProducts = async (e) => {
        e.preventDefault();
        let res = await fetch("http://localhost:5000/adminapi/indproducts/add", {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: indProd.name, description: indProd.description, category: indProd.category })
        })
        if (!res.ok) {
            alert("Issue occured in Individual Products");
        }

        res = await res.json();
        console.log(res);

        if (res.success) {

            setIndProd({ name: "", description: "", category: "" });

            alert(res.message);
            setIsIndividual(!isIndividual)
        }

        else {
            alert(res.message)
        }
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


            setCart([])

            setProdadd(false);
        } catch (error) {
            console.error("Error while adding product:", error);
            alert("Failed to add product");
        }
    };

    // const uniqueCategories = Array.from(new Set(individualProduct.map((prod) => prod.category)));


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = getallProd.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(getallProd.length / itemsPerPage);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };


    const indexOfLastItemBatch = currentPageBatch * itemsPerPageBatch;
    const indexOfFirstItemBatch = indexOfLastItemBatch - itemsPerPageBatch;
    const currentItemss = getProd.slice(indexOfFirstItemBatch, indexOfLastItemBatch);
    const totalpagess = Math.ceil(getProd.length / itemsPerPageBatch);

    const handlePageChangee = (newPage) => {
        setCurrentPageBatch(newPage);
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

            <button className='newad links' style={{ marginTop: "150px" }} onClick={() => { setIsIndividual(!isIndividual) }}>Add Individual product</button>
            {
                isIndividual ? (
                    <div className='admreg'>
                        <form onSubmit={addIndProducts}>
                            <button className='close' onClick={() => { setIsIndividual(!isIndividual) }}>X</button>
                            <div className='adminp'>
                                <label htmlFor="name">Product Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={indProd.name}
                                    required={true}
                                    onChange={handleIndProdChange}
                                />
                            </div>

                            <div className='adminp'>
                                <label htmlFor="description">Description</label>
                                <input
                                    type="text"
                                    name="description"
                                    value={indProd.description}
                                    required={true}
                                    onChange={handleIndProdChange}
                                />
                            </div>
                            <div className='adminp'>
                                <label htmlFor="category">Category</label>
                                <input
                                    type="text"
                                    name="category"
                                    value={indProd.category}
                                    required={true}
                                    onChange={handleIndProdChange}
                                />
                            </div>


                            <button type='submit'>Add Product</button>
                        </form>
                    </div>
                ) : ""
            }
            <button className='newad links' style={{ marginTop: "220px" }} onClick={() => { setProdadd(!prodadd) }}>Add new product</button>

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

                        {/* {prod.map((product, index) => (
                            <div key={index}>
                                <div className="adminp">
                                    <label htmlFor="name">Product Name</label>
                                 
                                    <select value={product.name} name="name" id="" onChange={(e) => handleProdChange(e, index)}>
                                        <option value="">Select</option>
                                        {
                                            individualProduct.map((e) => (
                                                <option value={e.name}>{e.name}</option>
                                            ))
                                        }
                                    </select>
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
                                    <select name="category" value={product.category} onChange={(e) => handleCategoryChange(e, index)}>
                                        <option value="">Select Category</option>
                                        {
                                            [...new Set(individualProduct.map((prod) => prod.category))].map((uniqueCategory) => (
                                                <option key={uniqueCategory} value={uniqueCategory}>{uniqueCategory}</option>
                                            ))
                                        }
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
                        ))} */}

                        {prod.map((product, index) => (
                            <div key={index}>
                                <div className="adminp">
                                    <label htmlFor="category">Category</label>
                                    <select
                                        name="category"
                                        value={product.category}
                                        onChange={(e) => handleCategoryChange(e, index)}
                                    >
                                        <option value="">Select Category</option>
                                        {[...new Set(individualProduct.map((prod) => prod.category))].map((uniqueCategory) => (
                                            <option key={uniqueCategory} value={uniqueCategory}>
                                                {uniqueCategory}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="adminp">
                                    <label htmlFor="name">Product Name</label>
                                    <select
                                        value={product.name}
                                        name="name"
                                        onChange={(e) => handleProdChange(e, index)}
                                    >
                                        <option value="">Select Product</option>
                                        {individualProduct
                                            .filter((prod) => prod.category === selectedCategory)
                                            .map((filteredProduct) => (
                                                <option key={filteredProduct.name} value={filteredProduct.name}>
                                                    {filteredProduct.name}
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                <div className="adminp">
                                    <label htmlFor="prod_desc">Product Description</label>
                                    <select
                                        disabled={true}
                                        value={product.prod_desc}
                                        name="prod_desc"
                                        onChange={(e) => handleProdChange(e, index)}
                                    >
                                        {/* <option value="">Product Description</option> */}
                                        {individualProduct
                                            .filter((prod) => prod.name === product.name)
                                            .map((filteredProduct) => (
                                                <option key={filteredProduct.description} value={filteredProduct.description}>
                                                    {filteredProduct.description}
                                                </option>
                                            ))}
                                    </select>
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
            <div>
                <button className='newad links' style={{ marginTop: "290px" }} onClick={() => { setIsProd(!isProd) }}>
                    See Batch Products
                </button>
                {
                    isProd && (
                        <div className='productss'>
                            <button className='prod-close' style={{ top: "0" }} onClick={() => { setIsProd(!isProd) }}>
                                X
                            </button>
                            <table className='product-table' border={2}>
                                <thead>
                                    <tr>
                                        <th>batche_no</th>
                                        <th>batch_quantity</th>
                                        <th>Name</th>
                                        <th>Price</th>
                                        <th>Category</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItemss.map((e) => (
                                        <tr key={e.id}>
                                            <td>{e.batche_no}</td>
                                            <td>{e.batch_quantity}</td>
                                            <td>{e.name}</td>
                                            <td>{e.price}</td>
                                            <td>{e.category}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div style={{ textAlign: "center" }}>
                                {Array.from({ length: totalpagess }, (_, index) => (
                                    <button
                                        key={index}
                                        style={{ margin: "5px" }}
                                        onClick={() => handlePageChangee(index + 1)}
                                        disabled={currentPageBatch === index + 1}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )
                }
            </div>

            <div>
                <button className='newad links' style={{ marginTop: "360px" }} onClick={() => setIsallProd(!isallProd)}>
                    See All Products
                </button>

                {isallProd && (
                    <div className='productss'>
                        <button className='prod-close' style={{ top: "0" }} onClick={() => setIsallProd(false)}>
                            X
                        </button>
                        <table className='product-table' border={2}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Category</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((e) => (
                                    <tr key={e.id}>
                                        <td>{e.name}</td>
                                        <td>{e.price}</td>
                                        <td>{e.category}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div style={{ textAlign: "center" }}>
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={index}
                                    style={{ margin: "5px" }}
                                    onClick={() => handlePageChange(index + 1)}
                                    disabled={currentPage === index + 1}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {cart.length > 0 && (
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
            )}


            {cart.length > 0 && <button style={{ width: "60px", margin: "10px auto", display: "block" }} onClick={addProduct}>Submit Products</button>
            }
            <Link style={{ textDecoration: "underline", display: "block", width: "70px", margin: "10px auto" }} className='links' to={`/orderhistory`}>Order History</Link>

        </div>
    )
}

export default AdminDashboard

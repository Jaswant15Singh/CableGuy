import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { toast } from 'react-toastify';
const AdminDashboard = () => {
    const [data, setData] = useState([]);
    const [inp, setInp] = useState({ name: "", email: "", password: "" });
    const [inpp, setInpp] = useState({ name: "", contact: "", address: "" });
    const [prod, setProd] = useState([{ name: "", prod_desc: "", description: "", category: "", price: "", supp_id: "", image: null }]);
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
    // console.log(adminid);
    const token = localStorage.getItem("adminlogintoken");
    const [adminreg, setAdminreg] = useState(false);
    const [supplieradd, setSupplieradd] = useState(false);
    const [prodadd, setProdadd] = useState(false);
    const [supplierlist, setSupplierlist] = useState([]);

    useEffect(() => {
        window.document.title = "Admin Dashboard"
    }, [])


    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    function createData(name, calories, fat, carbs, protein) {
        return { name, calories, fat, carbs, protein };
    }

    const rows = [
        createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
        createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
        createData('Eclair', 262, 16.0, 24, 6.0),
        createData('Cupcake', 305, 3.7, 67, 4.3),
        createData('Gingerbread', 356, 16.0, 49, 3.9),
    ];


    const [state, setState] = React.useState({

        bottom: false,

    });


    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState({ ...state, [anchor]: open });
    };

    const list = (anchor) => (
        <Box
            sx={{ width: 180 }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}

        >
            <List>
                <ListItem disablePadding>
                    <ListItemButton>
                        <Button
                            className="newad links"
                            onClick={() => setAdminreg(!adminreg)}
                            sx={{ width: '100%', mt: 3 }}
                            style={{ color: "black" }}
                        >
                            Add New Admin
                        </Button>
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton>
                        <Button
                            style={{ color: "black" }}
                            className="newad links"
                            sx={{ width: '100%', mt: 1 }}
                            onClick={() => setSupplieradd(!supplieradd)}
                        >
                            Add New Supplier
                        </Button>
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton>
                        <Button
                            style={{ color: "black" }}
                            className="newad links"
                            sx={{ width: '100%', mt: 1 }}
                            onClick={() => setIsIndividual(!isIndividual)}
                        >
                            Add Individual Product
                        </Button>
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton>
                        <Button
                            style={{ color: "black" }}
                            className="newad links"
                            sx={{ width: '100%', mt: 1 }}
                            onClick={() => setProdadd(!prodadd)}
                        >
                            Add New Product
                        </Button>
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton>
                        <Button
                            style={{ color: "black" }}
                            className="newad links"
                            sx={{ width: '100%', mt: 1 }}
                            onClick={() => setIsProd(!isProd)}
                        >
                            See Batch Products
                        </Button>
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton>
                        <Button
                            style={{ color: "black" }}
                            className="newad links"
                            sx={{ width: '100%', mt: 1 }}
                            onClick={() => setIsallProd(!isallProd)}
                        >
                            See All Products
                        </Button>
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider />
        </Box>
    );


    const handleChange = (e) => {
        setInp({ ...inp, [e.target.name]: e.target.value })
    }
    const handleeChange = (e) => {
        setInpp({ ...inpp, [e.target.name]: e.target.value })
    }


    const category = [{ id: 1, name: "Vegetable" }, { id: 2, name: "Fruit" }, { id: 3, name: "Gaming" }, { id: 4, name: "Study" }]

    // const handleProdChange = (e, index) => {
    //     const { name, value } = e.target;
    //     const updatedProducts = [...prod];
    //     updatedProducts[index] = {
    //         ...updatedProducts[index],
    //         [name]: value,
    //     };
    //     setProd(updatedProducts);
    // };

    const handleProdChange = (e, index) => {
        const { name, value, files } = e.target;
        const updatedProd = [...prod];

        if (name === "image") {
            updatedProd[index][name] = files[0];  // Handle file upload
        } else {
            updatedProd[index][name] = value;
        }

        setProd(updatedProd);
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
        console.log(res.data);
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
            alert("Some issue occured in fetching products")
        }

        res = await res.json();
        // console.log(res.message);

        if (res.success) {
            setGetProd(res.message)
        }

        else {
            // alert(res.message)
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
        // console.log(res.data);

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
            toast.error("Some issue occured")
        }

        res = await res.json();
        // console.log(res);
        if (!res.success) {
            toast.error(res.message)
        }
        toast.success(res.message);
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
            toast.error("Some issue occred");
        }


        res = await res.json();
        // console.log(res);

        if (!res.success) {
            toast.error(res.message)
        }

        else {
            toast.success(res.message);
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
            toast.error("Some issue occured");
        }

        res = await res.json();
        // console.log(res);

        if (!res.success) {
            toast.error(res.message);
        }

        toast.success(res.message);
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
            toast.error(res.message)
        }
        toast.success(res.message);
        setInpp({ name: "", email: "", password: "" })

        setSupplieradd(!supplieradd);

    }

    const addIndProducts = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", indProd.name);
        formData.append("description", indProd.description);
        formData.append("category", indProd.category);

        const isImg = document.querySelector('input[type="file"]').files[0];
        if (isImg) {
            formData.append("image", isImg)
        }

        let res = await fetch("http://localhost:5000/adminapi/indproducts/add", {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        })
        if (!res.ok) {
            toast.error("Issue occured in Individual Products");
        }

        res = await res.json();
        console.log(res);

        if (res.success) {

            setIndProd({ name: "", description: "", category: "" });

            toast.success(res.message);
            setIsIndividual(!isIndividual)
        }

        else {
            toast.error(res.message)
        }
    }
    const addMoreProducts = () => {
        const hasEmptyFields = prod.some((product) =>
            !product.name || !product.description || !product.category || !product.price || !product.batch_quantity
        );
        console.log(hasEmptyFields);
        if (hasEmptyFields) {
            alert("Enter previous records first");
            return;
        }
        setCart([...cart, ...prod])
        // setProd([{ name: '', description: '', category: '', price: '', batch_quantity: '' }]);
        console.log(cart);


        setProd([...prod, { name: "", prod_desc: "", description: "", category: "", price: "", supp_id: "", image: null }]);


    }


    const removeProduct = (index) => {
        const updatedProducts = cart.filter((_, i) => i !== index);
        setCart(updatedProducts);
    }
    // const addProduct = async (e) => {

    //     if (cart.length < 1) {
    //         alert("No orders placed");
    //         return;
    //     }
    //     const products = cart.map((product) => ({
    //         name: product.name,
    //         description: product.description,
    //         category: product.category,
    //         price: Number(product.price),
    //         batch_quantity: Number(product.batch_quantity),
    //     }));
    //     console.log(products);

    //     const requestData = {
    //         supp_id: Number(supplierId),
    //         products: products,
    //     };
    //     try {
    //         let res = await fetch("http://localhost:5000/adminapi/cr", {
    //             method: "POST",
    //             headers: {
    //                 "Authorization": `Bearer ${token}`,
    //                 "Content-Type": "application/json"
    //             },
    //             body: JSON.stringify(requestData)
    //         });

    //         if (!res.ok) {
    //             const errorMessage = await res.json();
    //             toast.error(errorMessage.message || 'Some issue occurred');
    //             return;
    //         }

    //         const responseData = await res.json();

    //         if (!responseData.success) {
    //             toast.error(responseData.message || 'Some issue occurred');
    //             return;
    //         }

    //         toast.success(responseData.message);


    //         setCart([])

    //         setProdadd(false);
    //     } catch (error) {
    //         console.error("Error while adding product:", error);
    //         alert("Failed to add product");
    //     }
    // };

    const addProduct = async (e) => {
        e.preventDefault();

        if (cart.length < 1) {
            alert("No orders placed");
            return;
        }

        const formData = new FormData();
        formData.append('supp_id', Number(supplierId));

        cart.forEach((product, index) => {
            formData.append(`products[${index}][name]`, product.name);
            formData.append(`products[${index}][description]`, product.description);
            formData.append(`products[${index}][category]`, product.category);
            formData.append(`products[${index}][price]`, Number(product.price));
            formData.append(`products[${index}][batch_quantity]`, Number(product.batch_quantity));

            if (product.image) {
                formData.append(`products[${index}][image]`, product.image);
            }
        });

        try {
            let res = await fetch("http://localhost:5000/adminapi/cr", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    // No Content-Type header; FormData will handle it
                },
                body: formData
            });

            if (!res.ok) {
                const errorMessage = await res.json();
                toast.error(errorMessage.message || 'Some issue occurred');
                return;
            }

            const responseData = await res.json();

            if (!responseData.success) {
                toast.error(responseData.message || 'Some issue occurred');
                return;
            }

            toast.success(responseData.message);
            setCart([]);
            setProdadd(false);
        } catch (error) {
            console.error("Error while adding product:", error);
            alert("Failed to add product");
        }
    };

    // const addProduct = async (e) => {
    //     e.preventDefault();

    //     if (cart.length < 1) {
    //         alert("No orders placed");
    //         return;
    //     }

    //     const formData = new FormData();
    //     formData.append('supp_id', Number(supplierId));

    //     cart.forEach((product) => {
    //         formData.append('products[]', JSON.stringify({
    //             name: product.name,
    //             description: product.description,
    //             category: product.category,
    //             price: Number(product.price),
    //             batch_quantity: Number(product.batch_quantity),
    //         }));
    //         if (product.image) {
    //             formData.append('images', product.image); // Using 'images' instead of 'images[]'
    //         }
    //     });

    //     try {
    //         let res = await fetch("http://localhost:5000/adminapi/cr", {
    //             method: "POST",
    //             headers: {
    //                 "Authorization": `Bearer ${token}`,
    //                 // No Content-Type header
    //             },
    //             body: formData
    //         });

    //         // Handle response...
    //     } catch (error) {
    //         console.error("Error while adding product:", error);
    //         alert("Failed to add product");
    //     }
    // };


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
            <div style={{ float: "right" }} className='dropdown'>
                <Button style={{ zIndex: "999", color: "black" }} onClick={toggleDrawer('right', true)}><ArrowDropDownIcon /> Add/See</Button>
                <Drawer
                    anchor="right"
                    open={state['right']}
                    onClose={toggleDrawer('right', false)}
                >
                    {list('right')}
                </Drawer>
            </div>


            <div style={{ padding: "0px 30px" }}>
                <h1 style={{ textAlign: "center", marginBottom: "10px", transform: "translateX(40px)", color: "#444444" }}>Admin Table</h1>

                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell style={{ width: "25%" }} align='left'>Role</StyledTableCell>
                                <StyledTableCell style={{ width: "25%" }} align="left"> Name</StyledTableCell>
                                <StyledTableCell style={{ width: "25%" }} align="left"> Email</StyledTableCell>
                                <StyledTableCell style={{ width: "25%" }} align="left">Update/Delete</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row) => (
                                <StyledTableRow key={row.name}>

                                    <StyledTableCell align="left">Admin</StyledTableCell>
                                    <StyledTableCell align="left">{row.name}</StyledTableCell>
                                    <StyledTableCell align="left">{row.email}</StyledTableCell>
                                    <StyledTableCell align="left"><Link className='links' to={`/admin/update/${row.id}`} >Update</Link>
                                        <button onClick={() => { handleDelete(row.id) }} className='links'>Delete</button></StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <div style={{ padding: "20px 30px", marginTop: "40px" }}>
                <h1 style={{ textAlign: "center", marginBottom: "10px", color: "#444444" }}>User Table</h1>

                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell style={{ width: "25%" }} align='left'>Role</StyledTableCell>
                                <StyledTableCell style={{ width: "25%" }} align="left"> Name</StyledTableCell>
                                <StyledTableCell style={{ width: "25%" }} align="left"> Email</StyledTableCell>
                                <StyledTableCell style={{ width: "25%" }} align="left">Update/Delete</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dataa.map((row) => (
                                <StyledTableRow key={row.name}>

                                    <StyledTableCell align="left">User</StyledTableCell>
                                    <StyledTableCell align="left">{row.name}</StyledTableCell>
                                    <StyledTableCell align="left">{row.email}</StyledTableCell>
                                    <StyledTableCell align="left"><Link className='links' to={`/admin/ind/${row.id}`} >Update</Link>
                                        <button className='links' onClick={() => { handleUserDelete(row.id) }}>Delete</button>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            {/* <div style={{ padding: "20px 30px", marginTop: "40px" }}>
                <h1 style={{ textAlign: "center", marginBottom: "10px", color: "#444444" }}>User Table</h1>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow style={{ borderBottom: "2px solid black" }}>
                                <TableCell align="left">Role</TableCell>
                                <TableCell align="left"> Name</TableCell>
                                <TableCell align="left">Email</TableCell>
                                <TableCell align="left">Update/Delete</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dataa.map((row) => (
                                <TableRow
                                    key={row.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                            
                                    <TableCell align="left">User</TableCell>
                                    <TableCell align="left">{row.name}</TableCell>
                                    <TableCell align="left">{row.email}</TableCell>

                                    <TableCell align="left"> <Link className='links' to={`/admin/update/${data.id}`} >Update</Link>
                                        <button onClick={() => { handleDelete(data.id) }} className='links'>Delete</button></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div> */}

            <div style={{ padding: "20px 30px", marginTop: "40px" }}>
                <h1 style={{ textAlign: "center", marginBottom: "10px", color: "#444444" }}>Suppliers Table</h1>

                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="left"> Name</StyledTableCell>
                                <StyledTableCell align="left"> Email</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {supplierlist.map((row) => (
                                <StyledTableRow key={row.name}>

                                    <StyledTableCell align="left">{row.name}</StyledTableCell>
                                    <StyledTableCell align="left">{row.contact}</StyledTableCell>

                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            {/* <div style={{ padding: "20px 30px", marginTop: "40px" }}>
                <h1 style={{ textAlign: "center", marginBottom: "10px", color: "#444444" }}>Suppliers Table</h1>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow style={{ borderBottom: "2px solid black" }}>
                                <TableCell align="left"> Name</TableCell>
                                <TableCell align="left">Contact</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {supplierlist.map((row) => (
                                <TableRow
                                    key={row.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >

                                    <TableCell align="left">{row.name}</TableCell>
                                    <TableCell align="left">{row.contact}</TableCell>


                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
          */}
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
                    <button type='submit' className='links'>Add Admin</button>
                </form> </div> : ""
            }

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
                    <button type='submit' className='links'>Add</button>
                </form> </div> : ""
            }

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
                            <div className="adminp">
                                <input type="file" />
                            </div>

                            <button type='submit' className='links'>Add Product</button>
                        </form>
                    </div>
                ) : ""
            }

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
                            <div key={index} style={{ overflowY: "auto" }}>
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
                                            .filter((prod) => prod.category === product.category)
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
                                    >
                                        {individualProduct
                                            .filter((prod) => prod.name === product.name)
                                            .map((filteredProduct) => (
                                                <option key={filteredProduct.description} value={filteredProduct.description}>
                                                    {filteredProduct.description}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                                {/*                                 
                                <div className="adminp">
                                    {individualProduct
                                        .filter((prod) => prod.name === product.name)
                                        .map((filteredProduct) => (
                                            <img
                                                key={filteredProduct.image}
                                                src={`http://localhost:5000${filteredProduct.image}`}
                                                alt={filteredProduct.name}
                                                style={{ maxWidth: '150px', height: 'auto' }}
                                            />
                                        ))}
                                </div> */}
                                {/* <div className="adminp">
                                    {individualProduct
                                        .filter((prod) => prod.name === product.name)
                                        .map((filteredProduct) => (
                                            <img
                                                key={filteredProduct.image}
                                                src={`http://localhost:5000${filteredProduct.image.replace('D:\\Practise4\\apis', '')}`}
                                                alt={filteredProduct.name}
                                                style={{ maxWidth: '150px', height: 'auto' }}
                                            />
                                        ))}
                                </div> */}


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
                                <div className="adminp">
                                    <label htmlFor="image">Upload Image</label>
                                    <input
                                        type="file"
                                        name="image"
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

                        <button className='links' type="button" onClick={addMoreProducts}>
                            Add More Products
                        </button>

                    </form>
                </div>
            ) : (
                ""
            )}
            <div>

                {
                    isProd && (

                        <div className='productss' style={{ backgroundColor: "aquamarine" }}>
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
                                        className='links'
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


                {isallProd && (

                    <div className='productss' style={{ backgroundColor: "aquamarine" }}>
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
                        <div style={{ textAlign: "center", zIndex: "100" }}>
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    className='links'
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
                <table className='productplaced' style={{ width: "50%", margin: "0 auto" }} border={2}>
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
                                        <td><button onClick={() => { removeProduct(index) }} className='links'>Remove</button></td>
                                    </tr>
                                )
                            })


                        }

                    </tbody>
                </table>
            )}


            {cart.length > 0 && <button style={{ width: "60px", margin: "10px auto", display: "block" }} onClick={addProduct} className='links'>Submit Products</button>
            }
            <Link style={{ display: "block", width: "70px", margin: "0px auto" }} className='links' to={`/orderhistory`}>Order History</Link>

        </div>
    )
}

export default AdminDashboard

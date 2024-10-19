import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";


const IndividualOrders = () => {
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [values, setValues] = useState([]);
    const itemsPerPage = 5;
    const { order_id } = useParams();
    console.log(order_id);
    const token = localStorage.getItem("userlogintoken");
    const adminToken = localStorage.getItem("adminlogintoken");
    let id = ''
    if (token) {
        const decoded = jwtDecode(token);
        console.log(decoded);
        id = decoded.userId;

    }
    if (adminToken) {
        const decodedd = jwtDecode(adminToken);
        console.log(decodedd);
        id = decodedd.adminId

    }



    // let id = "";
    // if (decoded.role == "admin") {
    //     id = decoded.adminId;
    // }
    // else {
    //     id = decoded.userId;
    // }
    // console.log(id);
    // const userId=decoded.userId;
    // const adminId=decodedd.adminId;

    useEffect(() => {
        getOrderDetails();
    }, [])

    const getOrderDetails = async () => {
        let res = await fetch("http://localhost:5000/adminapi/receipt", {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ order_id })
        });

        if (!res.ok) {
            console.log("Issue getting Individual receipt");

        }

        res = await res.json();
        if (res.success) {
            console.log(res);
            setValues(res.data)
        }

        else {
            res.json(res.message)
        }
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = values.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(values.length / itemsPerPage);

    // console.log("Current Page:", currentPage);
    // console.log("Index of First Item:", indexOfFirstItem);
    // console.log("Index of Last Item:", indexOfLastItem);
    // console.log("Current Items:", currentItems);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };
    return (
        <div style={{ minHeight: "80vh" }}>

            <table border={2} style={{ width: "80vw", margin: "10px auto" }}>
                <thead>
                    <tr>
                        {/* <th>Order Id</th> */}
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th>Price</th>

                    </tr>
                </thead>
                <tbody>
                    {
                        values.map((order, index) => (
                            <tr key={index}>
                                {/* <td>{order.order_id}</td> */}
                                <td>{order.product_name}</td>
                                <td>{order.category}</td>
                                <td>{order.quantity}</td>
                                <td>{order.price_at_purchase} <span> &#8377;</span></td>
                            </tr>
                        ))
                    }
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
            <h1 style={{textAlign:"center",fontWeight:"lighter"}}>Total Bill: <span>&#8377;</span><span style={{fontWeight:"bold"}}> {values.reduce((accum, e) => accum + e.total_price, 0)}</span></h1>
            <div style={{ textAlign: "center" }}>
                {token ? <Link className='links' to={`/userdashboard/${id}`}>Back</Link> : <Link className='links' to={`/admindashboard/${id}`}>Back</Link>}
                {/* {
                    decodedd.role = "admin" && <Link className='links' to={`/admindashboard/${adminId}`}>Back</Link>
                }
                {
                    decoded.role = "user" && <Link className='links' to={`/userdashboard/${userId}`}>Back</Link>
                } */}
                {/* {decoded.role="admin"?<Link className='links' to={`/admindashboard/${id}`}>Back</Link>:<Link className='links' to={`/userdashboard/${id}`}>Back</Link>} */}
            </div>
        </div>
    )
}

export default IndividualOrders

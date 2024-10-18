import React, { useEffect, useState } from 'react'
import { jwtDecode } from "jwt-decode";
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';

const OrderHistory = () => {
    const token = localStorage.getItem("userlogintoken") || localStorage.getItem("adminlogintoken");
    const [orderhis, setOrderhis] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [filterPrice, setFilterPrice] = useState("");
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    let isAdmin = "";
    let decoded;
    let name = ""
    if (token) {
        decoded = jwtDecode(token);
        isAdmin = decoded.role;
        name = decoded.name;
    }

    useEffect(() => {
        getOrderHistory();
    }, []);

    const getOrderHistory = async () => {
        try {
            let res = await fetch("http://localhost:5000/adminapi/orderhistory", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ user_id: decoded.userId, isAdmin: isAdmin === "admin" })
            });

            if (!res.ok) throw new Error("Failed to fetch order history");

            const data = await res.json();
            if (data.success) {
                setOrderhis(data.data);
                setFilteredProducts(data.data);
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const handleFilterChange = () => {
        let filteredData = [...orderhis];
        if (filterPrice) {
            filteredData = filteredData.filter((e) => e.price <= filterPrice);
        }
        setFilteredProducts(filteredData);
        setCurrentPage(1);
    };

    const handleSort = (type) => {
        const sortedData = [...filteredProducts].sort((a, b) => (
            type === "asc" ? a.customer_name.localeCompare(b.customer_name) : b.customer_name.localeCompare(a.customer_name)
        ));
        setFilteredProducts(sortedData);
        setCurrentPage(1);
    };

    const handleSortPrice = (type) => {
        const sortedData = [...filteredProducts].sort((a, b) => (
            type === "asc" ? a.price_at_purchase - b.price_at_purchase : b.price_at_purchase - a.price_at_purchase
        ));
        setFilteredProducts(sortedData);
        setCurrentPage(1);
    };

    const handleSortTotal = (type) => {
        const sortedData = [...filteredProducts].sort((a, b) => (
            type === "asc" ? a.total_price - b.total_price : b.total_price - a.total_price
        ));
        setFilteredProducts(sortedData);
        setCurrentPage(1);
    };

    const handleSearchSubmit = () => {
        const filteredData = orderhis.filter((e) =>
            e.customer_name.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredProducts(filteredData);
        setCurrentPage(1);
    };

    const handleSearchKeyDown = (e) => {
        handleSearchSubmit();
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    console.log(currentItems);


    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const generatePDF = (order) => {
        const doc = new jsPDF();
        doc.text(`Receipt for Order: ${order.order_id}`, 10, 10);
        doc.text(`Customer Name: ${order.customer_name}`, 10, 20);
        doc.text(`Customer Contact: ${order.customer_contact}`, 10, 30);
        doc.text(`Product: ${order.product_name}`, 10, 40);
        doc.text(`Category: ${order.category}`, 10, 50);
        doc.text(`Quantity: ${order.quantity}`, 10, 60);
        doc.text(`Price at Purchase: ${order.price_at_purchase}`, 10, 70);
        doc.text(`Total Price: ${order.total_price}`, 10, 80);
        doc.save(`receipt_${order.order_id}.pdf`);

    };

    return (
        <div className='orderhistory' style={{ minHeight: "80vh" }}>
            <h1 style={{ textAlign: "center", margin: "15px" }}>Hello {name}</h1>
            <Link className='links' to={isAdmin === "admin" ? `/admindashboard/${decoded.adminId}` : `/userdashboard/${decoded.userId}`} style={{ textDecoration: "underline", display: "block", width: "70px", margin: "10px auto" }}>
                Back
            </Link>

            <div style={{ display: "flex", justifyContent: "space-around" }}>
                <button onClick={() => setFilteredProducts(orderhis)}>See all</button>
                <button onClick={() => handleSortPrice("asc")}>Sort by Price(asc)</button>
                <button onClick={() => handleSortPrice("desc")}>Sort by Price(desc)</button>
                <button onClick={() => handleSort("asc")}>Sort by Name(asc)</button>
                <button onClick={() => handleSort("desc")}>Sort by Name(desc)</button>
                <button onClick={() => handleSortTotal("asc")}>Sort by Total Price(asc)</button>
                <button onClick={() => handleSortTotal("desc")}>Sort by Total Price(desc)</button>
            </div>

            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search by customer name"
            />
            <button onClick={handleSearchSubmit}>Search</button>

            <table border={2} style={{ width: "80vw", margin: "10px auto" }}>
                <thead>
                    <tr>
                        <th>Customer Name</th>
                        <th>Customer Contact</th>
                        <th>Customer Email</th>
                        <th>Product Name</th>
                        <th>Product Category</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total Price</th>
                        <th>Receipt</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((e, index) => (
                        <tr key={index}>
                            <td>{e.customer_name}</td>
                            <td>{e.customer_contact}</td>
                            <td>{e.email}</td>
                            <td>{e.product_name}</td>
                            <td>{e.category}</td>
                            <td>{e.quantity}</td>
                            <td>{e.price_at_purchase}</td>
                            <td>{e.total_price}</td>
                            <td><button className='links' onClick={() => generatePDF(e)}>Download</button></td>
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
    );
}

export default OrderHistory;

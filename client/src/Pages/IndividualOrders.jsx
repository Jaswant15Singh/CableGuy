import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import jsPDF from 'jspdf';


const IndividualOrders = () => {
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [values, setValues] = useState([]);
    const itemsPerPage = 5;
    const { order_id } = useParams();
    const token = localStorage.getItem("userlogintoken");
    const adminToken = localStorage.getItem("adminlogintoken");
    let id = '';

    if (token) {
        const decoded = jwtDecode(token);
        id = decoded.userId;
    }
    if (adminToken) {
        const decodedd = jwtDecode(adminToken);
        id = decodedd.adminId;
    }

    useEffect(() => {
        getOrderDetails();
    }, []);

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
            setValues(res.data);
        } else {
            console.log(res.message);
        }
    };

    const generatePDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text(`Receipt for Order: ${order_id}`, 10, 20);

        doc.setDrawColor(0, 0, 0);
        doc.line(10, 25, 200, 25);

        if (values.length > 0) {
            doc.setFontSize(12);
            const headers = ['Product Name', 'Category', 'Quantity', 'Price', 'Total'];
            const headerY = 30;

            headers.forEach((header, index) => {
                doc.text(header, 10 + (index * 40), headerY);
            });

            doc.line(10, headerY + 2, 200, headerY + 2);

            let y = headerY + 10;
            values.forEach((order) => {
                doc.text(order.product_name, 10, y);
                doc.text(order.category, 50, y);
                doc.text(String(order.quantity), 90, y);
                doc.text(String(order.price_at_purchase), 130, y);

                doc.text(String(order.total_price), 170, y);
                y += 10;
            });

            const totalBill = values.reduce((accum, e) => accum + e.total_price, 0);
            doc.text(`Total Bill: ${totalBill}`, 10, y + 10);
        } else {
            doc.text("No products found for this order.", 10, 30);
        }

        doc.save(`receipt_${order_id}.pdf`);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = values.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(values.length / itemsPerPage);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div style={{ minHeight: "80vh" }}>
            <button className='links' onClick={generatePDF} style={{ margin: "10px", padding: "5px", border: "none", display: "block", margin: "20px auto" }}>
                Download PDF
            </button>
            <table border={2} style={{ width: "80vw", margin: "10px auto" }}>
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        currentItems.map((order, index) => (
                            <tr key={index}>
                                <td>{order.product_name}</td>
                                <td>{order.category}</td>
                                <td>{order.quantity}</td>
                                <td>{order.price_at_purchase} <span>&#8377;</span></td>
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
            <h1 style={{ textAlign: "center", fontWeight: "lighter" }}>
                Total Bill: <span>&#8377;</span><span style={{ fontWeight: "bold" }}> {values.reduce((accum, e) => accum + e.total_price, 0)}</span>
            </h1>
            <div style={{ textAlign: "center" }}>
                {token ? <Link className='links' to={`/userdashboard/${id}`}>Back</Link> : <Link className='links' to={`/admindashboard/${id}`}>Back</Link>}
            </div>
        </div>
    );
};

export default IndividualOrders;

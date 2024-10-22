import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import jsPDF from 'jspdf';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

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
    console.log(currentItems);

    const totalPages = Math.ceil(values.length / itemsPerPage);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div style={{ minHeight: "80vh",backgroundColor:"#D8E3DB",padding:"10px 0" }}>
            <button className='links' onClick={generatePDF} style={{padding: "5px", border: "none", display: "block", margin: "0px auto" ,marginBottom:"10px"}}>
                Download PDF
            </button>
          
            {/* <div style={{ padding: "0px 30px" }}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="right">Product Name</TableCell>
                                <TableCell align="right">Category</TableCell>
                                <TableCell align="right">Quantity</TableCell>
                                <TableCell align="right">Price</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentItems.map((row) => (
                                <TableRow
                                    key={row.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                  
                                    <TableCell align="right">{row.product_name}</TableCell>
                                    <TableCell align="right">{row.category}</TableCell>
                                    <TableCell align="right">{row.quantity}</TableCell>
                                    <TableCell align="right">{row.price_at_purchase}</TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div> */}

            <div style={{ padding: "0px 30px" }}>

                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align='left'>Product Name</StyledTableCell>
                                <StyledTableCell align="left"> Category</StyledTableCell>
                                <StyledTableCell align="left"> Quantity</StyledTableCell>
                                <StyledTableCell align="left">Price</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentItems.map((row) => (
                                <StyledTableRow key={row.name}>

                                    <StyledTableCell align="left">{row.product_name}</StyledTableCell>
                                    <StyledTableCell align="left">{row.category}</StyledTableCell>
                                    <StyledTableCell align="left">{row.quantity}</StyledTableCell>
                                    <StyledTableCell align="left">{row.price_at_purchase}</StyledTableCell>

                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <div style={{ textAlign: "center" ,marginBottom:"15px"}}>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        className='links'

                        key={index}
                        style={{ margin: "5px", padding: "5px" }}
                        onClick={() => handlePageChange(index + 1)}
                        disabled={currentPage === index + 1}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
            <div style={{ textAlign: "center"}}>
            <h1 style={{display:"inline", fontWeight: "lighter",margin:"15px 0" ,padding:"10px",borderRadius:"5px",backgroundColor:"rgb(234, 236, 235)",border:"1px solid black"}}>
                Total Bill: <span>&#8377;</span><span style={{ fontWeight: "600"}}> {values.reduce((accum, e) => accum + e.total_price, 0)}</span>
            </h1>
            </div>
            <div style={{ textAlign: "center",marginTop:"20px" }}>
                {token ? <Link className='links' to={`/orderhistory`}>Back</Link> : <Link className='links' to={`/orderhistory`}>Back</Link>}
            </div>
        </div>
    );
};

export default IndividualOrders;

import React, { useEffect, useState } from 'react'
import { jwtDecode } from "jwt-decode";
import { Link } from 'react-router-dom';

const OrderHistory = () => {
    const token = localStorage.getItem("userlogintoken");
    const [orderhis, setOrderhis] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [filtertotalprice, setFiltertotalprice] = useState("");
    const [filterPrice, setFilterPrice] = useState("");
    const [search, setSearch] = useState('')
    console.log(token);
    const decoded = jwtDecode(token);

    console.log(decoded);
    useEffect(() => {
        getOrderHistory();
    }, [])

    const getOrderHistory = async () => {
        let res = await fetch("http://localhost:5000/adminapi/orderhistory", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!res.ok) {
            alert("Some issue occured while fetching order history")
        }

        res = await res.json();
        if (res.success) {
            console.log(res.data);
            setOrderhis(res.data);
            setFilteredProducts(res.data)
        }

        else {
            alert(res.message)
        }
    }

    const handleFilterChange = () => {
        let filteredData = [...orderhis];

        if (filterPrice) {
            filteredData = filteredData.filter((e) => {
                return e.price <= filterPrice
            })
        }

        else if (nameasc) {
            filteredData = filteredData.sort((a, b) => {
                return a.customer_name.localeCompare(b.customer_name)
            })
        }
        setFilteredProducts(filteredData)
    }

    const handleSort = (type) => {
        const sortedData = [...orderhis];
        sortedData.sort((a, b) => (
            type === "asc" ? a.customer_name.localeCompare(b.customer_name) : b.customer_name.localeCompare(a.customer_name)
        ))
        setFilteredProducts(sortedData)
    }

    const handleSortPrice = (type) => {
        const sortedData = [...orderhis];

        sortedData.sort((a, b) => (
            type === "asc" ? a.price_at_purchase - b.price_at_purchase : b.price_at_purchase - a.price_at_purchase
        ))
        setFilteredProducts(sortedData)
    }

    const handleSortQuan = (type) => {
        const sortedData = [...orderhis];

        sortedData.sort((a, b) => {
            return type === "asc" ? a.quantity - b.quantity : b.quantity - a.quantity
        })
        setFilteredProducts(sortedData)

    }

    const handleSortTotal=(type)=>{
        let sortedData=[...orderhis];
        sortedData=sortedData.sort((a,b)=>{
            return type==='asc'?a.total_price-b.total_price:b.total_price-a.total_price
        })
        setFilteredProducts(sortedData);
    }

    const handleSearchSubmit = () => {
        let sorteddata = [...orderhis];

        sorteddata = sorteddata.filter((e) => {
            return e.customer_name.toLowerCase().includes(search.toLocaleLowerCase())
        })
        setFilteredProducts(sorteddata)
    }


    return (
        <div className='orderhistory'>

            <Link style={{ textDecoration: "underline", display: "block", width: "70px", margin: "10px auto" }} className='links' to={`/userdashboard/${decoded.userId}`}>Back</Link>





            {/* <select name="" id="" onChange={(e) => { setFilterPrice(e.target.value); handleFilterChange() }}>
                <option value="">Filter by Max Price</option>
                <option value="50">Up to 50</option>
                <option value="100">Up to 100</option>
                <option value="200">Up to 200</option>
                <option value="500">Up to 500</option>
                <option value="1000">Up to 1000</option>
            </select> */}
           <div style={{display:"flex",justifyContent:"space-around"}}>
           <button className='links' onClick={() => { setFilteredProducts(orderhis) }}>See all</button>
            <button className='links' onClick={() => { handleSortPrice("asc") }}>Sort by Price(asc)</button>
            <button className='links' onClick={() => { handleSortPrice("desc") }}>Sort by Price(dsc)</button>
            <button className='links' onClick={() => { handleSortQuan("asc") }}>Sort by Quantity(asc)</button>
            <button className='links' onClick={() => { handleSortQuan("desc") }}>Sort by Quantity(dsc)</button>
            <button className='links' onClick={() => { handleSort("asc") }}>Sort by Name(asc)</button>
            <button className='links' onClick={() => { handleSort("desc") }}>Sort by Name(dsc)</button>
            <button className='links' onClick={() => { handleSortTotal("asc") }}>Sort by Total Price(asc)</button>
            <button className='links' onClick={() => { handleSortTotal("desc") }}>Sort by Total Price(dsc)</button>
           </div>
            <br />
            <br />
            <input onKeyDown={()=>{handleSearchSubmit()}} type="text" value={search} onChange={(e) => { setSearch(e.target.value) }} name="" id="" />
            <button className='links' onClick={handleSearchSubmit}>Search</button>

            {/* <select name="" id="" value={filtertotalprice} onChange={(e) => { setFiltertotalprice(e.target.value); handleFilterChange() }}>

            </select> */}
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
                    </tr>
                </thead>
                <tbody>
                    {
                        filteredProducts.map((e) => (
                            <tr>
                                <td>{e.customer_name}</td>
                                <td>{e.customer_contact}</td>
                                <td>{e.email}</td>
                                <td>{e.name}</td>
                                <td>{e.category}</td>
                                <td>{e.quantity}</td>
                                <td>{e.price_at_purchase}</td>
                                <td>{e.total_price}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

        </div>
    )
}

export default OrderHistory

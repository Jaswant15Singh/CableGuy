import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { jsPDF } from 'jspdf';
import { toast } from 'react-toastify';

const Userdashboard = () => {
  const [data, setData] = useState({ name: "", email: "" });
  const [update, setUpdate] = useState(false);
  const [updatedata, setUpdatedata] = useState({ name: "", email: "" });
  const [customerData, setCustomerData] = useState({ name: "", contact: "", email: "" });
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState('');
  const [addProd, setAddProd] = useState(true);
  const [individualProduct, setIndividualProduct] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [receipt, setReceipt] = useState([]);
  const [sortBasis, setSortBasis] = useState("default");
  const token = localStorage.getItem("userlogintoken");

  const { id } = useParams();
  const decoded = jwtDecode(token);
  // console.log(decoded);


  useEffect(() => {
    getSingleUser();
    getAllProducts();
    getIndividyalProducts();
  }, []);
  useEffect(()=>{
    window.document.title="About Us"
},[])

  useEffect(() => {
    if (data) {
      setUpdatedata({
        name: data.name || "",
        email: data.email || ""
      });
    }
  }, [data]);
  const handleChange = (e) => {
    setUpdatedata({ ...updatedata, [e.target.name]: e.target.value });
  };

  const handleCustomerChange = (e) => {
    setCustomerData({ ...customerData, [e.target.name]: e.target.value })
  }
  const handleCustomerContact = (e) => {

    const { name, value } = e.target;

    if (/^\d*$/.test(value) && value.length <= 10) {
      setCustomerData({
        ...customerData,
        [name]: value
      });
    }

  }
  const getSingleUser = async () => {
    try {
      let res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) {
        throw new Error('Some issue occurred');
      }

      const result = await res.json();
      setData(result.data);
    } catch (error) {
      alert(error.message);
    }
  };

  const getAllProducts = async () => {
    let res = await fetch("http://localhost:5000/adminapi/products", {
      method: "GET",

      headers: {
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    if (!res.ok) {
      alert("Failed to fetch products");
      return;
    }

    res = await res.json();
    // console.log(res.data);
    // console.log(12);



    //     res.data.forEach((e)=>{
    //       console.log(e.category);

    //     })
    // setTimeout(()=>{
    //   console.log(`cat is ${selectedCategory}`);

    // },1000)    
    setProducts(res.data);
    console.log([...new Set(products.map((e) => e.category))]);


  }

  const getIndividyalProducts = async () => {
    let res = await fetch("http://localhost:5000/adminapi/indproducts", {
      method: "GET",

      headers: {
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    if (!res.ok) {
      alert("Some issue occured while fetching individual datas");
      return;
    }
    res = await res.json();
    // console.log(res.data);
    setIndividualProduct(res.data)

  }
  const handleUpdateClick = async (e) => {
    e.preventDefault();
    try {
      let res = await fetch(`http://localhost:5000/api/users/update/${id}`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: updatedata.name, email: updatedata.email })
      });

      if (!res.ok) {
        toast.error("Some issue occurred");
      }

      const result = await res.json();

      setData({ name: updatedata.name, email: updatedata.email });

      toast.success("Updated Successfully");
      setUpdate(false);

      setTimeout(() => {
        getSingleUser();
      }, 300);

    } catch (error) {
      toast.error(error.message);
    }
  };


  const handleAddProduct = (e) => {
    if (customerData.contact.length < 10) {
      toast.error("Enter phone Number of 10 digits");
      return;
    }
    console.log(typeof selectedProduct);
    if (selectedProduct && selectedQuantity) {
      const existingProduct = cart.find((e) => e.id === Number(selectedProduct));
      if (existingProduct) {
        const updatedCart = cart.map((e) =>
          e.id === Number(selectedProduct)
            ? { ...e, quantity: e.quantity + Number(selectedQuantity) }
            : e
        );
        setCart(updatedCart)
      }
      else {
        const prod = products.find((e) => e.id === Number(selectedProduct));
        console.log(prod);
        if (prod) {
          setCart([...cart, { ...prod, quantity: Number(selectedQuantity) }])
        }
      }
    }
  }

  // const handleAddProduct = (e) => {
  //   if (selectedProduct && selectedQuantity) {
  //     const existingProduct = cart.find((e) => e.id === Number(selectedProduct));
  //     if (existingProduct) {
  //       // Update the quantity of the existing product
  //       const updatedCart = cart.map((e) =>
  //         e.id === Number(selectedProduct)
  //           ? { ...e, quantity: e.quantity + Number(selectedQuantity) }
  //           : e
  //       );
  //       setCart(updatedCart);
  //     } else {
  //       // Add new product to cart
  //       const prod = products.find((e) => e.id === Number(selectedProduct));
  //       if (prod) {
  //         setCart([...cart, { ...prod, quantity: Number(selectedQuantity) }]);
  //       }
  //     }
  //   }
  // };


  const placeOrders = async () => {
    if (!customerData.name || !customerData.contact) {
      toast.warn("Enter User Details ");
      return;
    }
    const orderData = {
      customer_name: customerData.name,
      customer_contact: customerData.contact,

      user_id: decoded.userId,
      email: customerData.email,
      cart: cart.map(item => ({ id: item.id, quantity: item.quantity }))
    }

    let res = await fetch("http://localhost:5000/adminapi/placeorder", {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderData)
    });
    if (!res.ok) {
      alert("Failed to Place Orders");
      return;
    }
    try {
      res = await res.json();
      const order_id = res.orderId;
      // console.log(res);
      if (res.success) {
        alert("Order placed successfully");
        setCart([]);
        setCustomerData({ name: "", contact: "" });
        setSelectedProduct("");
        setSelectedQuantity("");
        let res = await fetch("http://localhost:5000/adminapi/receipt", {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ order_id })
        });
        if (!res.ok) {
          toast.error("Issue dring receipts !200")
        }

        try {
          res = await res.json();
          console.log(res);
          setReceipt(res.data)
        } catch (error) {
          console.log(res);

        }

      }
      else {
        alert(res.message)
      }
    } catch (error) {
      toast.error(error)
    }

  }

  const removeProduct = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1)
    setCart(newCart)
  }

  const sortedBasis = () => {
    const prod = products.filter((e) =>
      e.category.toLowerCase().includes(selectedCategory.toLowerCase())
    );

    switch (sortBasis) {
      case "low-price": return prod.sort((a, b) => {
        if (a.price !== b.name) {
          return a.price - b.price

        }
        else {
          return a.name.localeCompare(b.name)
        }
      });

      case "high-price": return prod.sort((a, b) => {
        if (a.price !== b.name) {
          return b.price - a.price

        }
        else {
          return a.name.localeCompare(b.name)
        }
      });

      case "name": return prod.sort((a, b) => a.name.localeCompare(b.name))
      default: return prod

    }

  };


  const generatePDF = () => {
    const doc = new jsPDF();

    if (receipt.length > 0) {
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      const title = "Payment Receipt";
      const titleWidth = doc.getStringUnitWidth(title) * doc.getFontSize() / doc.internal.scaleFactor;
      const titleX = (doc.internal.pageSize.width - titleWidth) / 2;
      doc.text(title, titleX, 20);

      doc.setDrawColor(0, 0, 0);
      doc.line(10, 25, 200, 25);

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Customer Name: ${receipt[0].customer_name}`, 14, 40);
      doc.text(`Contact: ${receipt[0].customer_contact}`, 14, 46);
      doc.text(`Email: ${receipt[0].email}`, 14, 52);

      doc.line(14, 55, 200, 55);

      const startY = 60;
      const headerHeight = 10;
      doc.setFillColor(220, 220, 220);
      doc.rect(14, startY, 182, headerHeight, "F");

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Product Name", 15, startY + 7);
      doc.text("Category", 75, startY + 7);
      doc.text("Quantity", 110, startY + 7);
      doc.text("Price", 140, startY + 7);
      doc.text("Total", 170, startY + 7);

      doc.setFont("helvetica", "normal");

      doc.setDrawColor(0, 0, 0);
      doc.line(14, startY + headerHeight, 200, startY + headerHeight);

      receipt.forEach((e, index) => {
        const yOffset = startY + headerHeight + 10 + (index * 30);
        doc.text(e.product_name, 15, yOffset);
        doc.text(e.category, 75, yOffset);
        doc.text(e.quantity.toString(), 110, yOffset);
        doc.text(e.price_at_purchase, 140, yOffset);
        doc.text(e.total_price.toFixed(2), 170, yOffset);

        doc.line(14, yOffset + 3, 200, yOffset + 3);
      });

      const totalPrice = receipt.reduce((acc, e) => acc + e.total_price, 0).toFixed(2);
      doc.setFontSize(12);
      doc.text(`Total Amount: ${totalPrice}`, 14, startY + headerHeight + 10 + (receipt.length * 30) + 10);
      doc.text("Thank you for your purchase!", 14, startY + headerHeight + 10 + (receipt.length * 30) + 20);
    }

    doc.save("receipt.pdf");
  };
  return (


    <div className='userdash'>
      <div className="mainformdiv">
        <img className='userdashimage' src="https://png.pngtree.com/thumb_back/fh260/background/20230618/pngtree-fully-stocked-warehouse-rack-3d-rendering-of-cardboard-box-inventory-image_3638745.jpg" alt="" />

        {update ? (
          <div className=" formdiv loginn">
            <form onSubmit={handleUpdateClick}>
              <h1>Login</h1>
              <div className='inp'>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  name="name"
                  value={updatedata.name}
                  onChange={handleChange}
                />
              </div>
              <div className='inp'>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  value={updatedata.email}
                  onChange={handleChange}
                />
              </div>
              <button className='links' style={{ border: "none", marginTop: "20px", cursor: "pointer" }} type='submit'>Update Data</button>

            </form>
            <button style={{ display: "block", margin: "10px auto", padding: "5px", cursor: "pointer" }} className='links' onClick={() => setUpdate(false)}>Back</button>
          </div>

          // <div className='formdiv'>

          //   <form onSubmit={handleUpdateClick} className='updateform'>
          //     <h1 style={{ marginBottom: "-10px" }}>Update User</h1>
          //     <div className='updateinp'>
          //       <label htmlFor="name">Name</label>
          //       <input
          //         type="text"
          //         name="name"
          //         value={updatedata.name}
          //         onChange={handleChange}
          //       />
          //     </div>
          //     <div className='updateinp'>
          //       <label htmlFor="email">Email</label>
          //       <input
          //         type="email"
          //         name="email"
          //         value={updatedata.email}
          //         onChange={handleChange}
          //       />
          //     </div>
          //     <button className='links' style={{ border: "none", marginTop: "20px", cursor: "pointer" }} type='submit'>Update Data</button>


          //   </form>
          //   <button style={{ display: "block", margin: "10px auto", padding: "5px", cursor: "pointer" }} className='links' onClick={() => setUpdate(false)}>Back</button>
          // </div>
        ) : (
          <div className='detailsdiv'>
            <div className="details">
              <h1>Welcome {data.name}</h1>
              <button className='links' onClick={() => setUpdate(true)}>Update</button>
            </div>
          </div>
        )}
      </div>
      {addProd ?
        <div className='maindivprod'>
          <div className='products'>
            <div className='customer'>
              <h1>Customer's information</h1>
              <div>
                <label htmlFor="name">Name</label>
                <input type="text" required={true} name="name" id="" value={customerData.name} onChange={handleCustomerChange} />
              </div>
              <div>
                <label htmlFor="email">Email</label>
                <input type="email" required={true} name="email" id="" value={customerData.email} onChange={handleCustomerChange} />
              </div>
              <div>
                <label htmlFor="contact">Contact</label>
                <input
                  type="text"
                  required
                  name="contact"
                  id="contact"
                  value={customerData.contact}
                  onChange={handleCustomerChange}
                  minLength={10}
                  maxLength={10}
                  pattern="\d{10}"
                  title="Please enter a valid 10-digit phone number"
                />              </div>
            </div>


            <div className='prods'>
              <h1>Products in Stock</h1>
              <select name="" id="" value={selectedCategory} onChange={(e) => {
                setSelectedCategory(e.target.value);
                console.log("Selected Category:", e.target.value);
                console.log(typeof selectedCategory);

              }}>
                <option value="">Select Category</option>
                {
                  [...new Set(products.map((prod) => prod.category))].map((e, index) => (
                    <option value={e} key={index}>{e}</option>
                  ))
                }

                {/* {
                  [...new Set(products.map((prod) => prod.category))].map((e, index) => (
                    <option value={e} key={index}>{e}</option>
                  ))
                } */}
              </select>
              <select name="" id="" onChange={(event) => {
                setSortBasis(event.target.value);
              }}>
                <option value="default">Select Sorting Method</option>
                <option value="low-price"><button>Price-Lower to Higher</button></option>
                <option value="high-price"><button>Price-Higher to Lower</button></option>
                <option value="name">Sort By name</option>
              </select>
              <select className='select' name="" id="" value={selectedProduct} onChange={(e) => { setSelectedProduct(e.target.value) }}>
                <option value="">Select</option>

                {

                  sortedBasis()
                    .map((e) => (
                      <option value={e.id} key={e.id}>
                        {e.name} - ${e.price} (Available: {e.quantity}) - {e.description}
                      </option>
                    ))

                }


              </select>
            </div>
            <div className='num'>
              <input type="number" name="selectedNumber" id="" value={selectedQuantity < 0 ? 0 : selectedQuantity} onChange={(e) => { setSelectedQuantity(e.target.value) }} />
            </div>
            <button className='links' onClick={handleAddProduct}>Add Product</button>

          </div>
        </div>
        : ""}

      {cart.length > 0 && <div className='orderplace'>
        {cart.map((e, index) => {
          return (
            <>
              <div className='orderdet'>
                <h1 style={{ margin: "10px 5px" }}>{e.name} <span>quantity:{e.quantity}</span></h1>
                <button className='links' style={{ height: "30px", padding: "0 10px", cursor: "pointer" }} onClick={() => {
                  removeProduct(index)
                }}>Remove</button>


              </div>
              <hr /></>
          )
        })}
        <div className='totalitems' style={{ margin: "5px" }}>{cart.length}</div>
        <h2 style={{ margin: "5px" }}>Total amount is:{cart.reduce((total, e) => {
          return total += e.price * e.quantity
        }, 0)} ₹</h2>
        <button className='links' style={{ margin: "20px 5px", padding: "5px 10px", cursor: "pointer" }} onClick={placeOrders}>Place Order</button>
      </div>}
      {receipt.length > 0 ? (
        <div className='receipt'>
          <h1 style={{ textAlign: "center" }}>Payment Receipt</h1>
          <p><strong>Customer Name:</strong> {receipt[0].customer_name}</p>
          <p><strong>Contact:</strong> {receipt[0].customer_contact}</p>
          <p><strong>Email:</strong> {receipt[0].email}</p>
          <hr />
          {receipt.map((e, index) => (
            <div key={index}>

              <p><strong>Product Name:</strong> {e.product_name}</p>
              <p><strong>Category:</strong> {e.category}</p>
              <p><strong>Quantity:</strong> {e.quantity}</p>
              <p><strong>Price at Purchase:</strong> {e.price_at_purchase}</p>
              <p><strong>Total Price:</strong> {e.total_price}</p>
              <hr />
              <hr />
            </div>
          ))}
          <h2>Cumulative Total</h2>
          <p><strong>Total Amount Paid:</strong> ₹{
            receipt.reduce((acc, curr) => acc + curr.total_price, 0)
          }</p>

          <button onClick={generatePDF}>Download Receipt as PDF</button>
        </div>
      ) : (
        ""
      )}


      <Link style={{ textDecoration: "underline", display: "block", width: "70px", margin: "0px auto" }} className='links' to={`/orderhistory`}>Order History</Link>
    </div>


  );
};

export default Userdashboard;

import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Headers from './Components/Headers'
import Footer from './Components/Footer'
import Userdashboard from './Components/Userdashboard'
import Userlogin from './Pages/Userlogin'
import Home from './Pages/Home'
import Adminlogin from './Pages/Adminlogin'
import AdminDashboard from './Components/AdminDashboard'
import AdminUpdate from './Components/AdminUpdate'
import IndUsers from './Components/IndUsers'
import { jwtDecode } from "jwt-decode";
import { useParams } from 'react-router-dom';
import OrderHistory from './Pages/OrderHistory'
import IndividualOrders from './Pages/IndividualOrders'
import About from './Components/About'
import Footers from './Components/Footers'


function App() {
  return (
    <>
      <BrowserRouter>
        <Footer />
        <Headers />
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/userdashboard/:id' element={<ProtectedRoute><Userdashboard /></ProtectedRoute>} />
          <Route path='/userlogin' element={<Userlogin />} />
          <Route path='/adminlogin' element={<Adminlogin />} />
          <Route path='/admindashboard/:adminid' element={<AdminProtRoute><AdminDashboard /></AdminProtRoute>} />
          <Route path='/admin/update/:id' element={<AdminProtRoute><AdminUpdate /></AdminProtRoute>} />
          <Route path='/admin/ind/:id' element={<AdminProtRoute><IndUsers /></AdminProtRoute>} />
          <Route path='/orderhistory' element={<ProtRoute><OrderHistory /></ProtRoute>} />
          <Route path='/individualorders/:order_id' element={<IndividualOrders />} />
          <Route path="*" element={<div style={{ minHeight: "80vh", display: "flex", justifyContent: "center", alignItems: "center" }}><h1>404-Page Not Found</h1></div>} />
        </Routes>
        <Footers />
      </BrowserRouter>
    </>
  )
}


// const ProtectedRoute = ({ children }) => {
//   const token = localStorage.getItem("userlogintoken");
//   console.log(token);
//   const decoded=jwtDecode(token);
//   console.log(decoded);


//   if (token) {
//     return children;
//   } else {
//     return <Navigate to="/userlogin" />;
//   }
// };


const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("userlogintoken");

  if (!token) {
    return <Navigate to="/userlogin" />;
  }

  try {
    const decoded = jwtDecode(token);
    console.log("Decoded Token:", decoded);

    const userId = decoded.userId;
    const { id: userIdFromParams } = useParams();
    console.log(typeof userIdFromParams);
    console.log(typeof userId);
    console.log("User ID from Token:", userId);
    console.log("User ID from Params:", userIdFromParams);
    if (userId !== parseInt(userIdFromParams)) {
      console.log("Unauthorized access detected!");
      return <h1>Unauthorized Access</h1>;
    }
    return children;
  } catch (error) {
    console.error("Error decoding token:", error);
    return <Navigate to="/userlogin" />;
  }
};


const ProtRoute = ({ children }) => {
  const token = localStorage.getItem("userlogintoken");
  const admin_token = localStorage.getItem("adminlogintoken");
  if (token || admin_token) {
    return children
  }
  else {
    return <h1>Cannot Access Order History</h1>
  }
}


const AdminProtRoute = ({ children }) => {
  const admin_token = localStorage.getItem("adminlogintoken");
  if (admin_token) {
    return children
  }
  else {
    return <h1>Cannot Access Order History</h1>
  }
}


const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("adminlogintoken");

  if (!token) {
    return <Navigate to="/adminlogin" />;
  }

  try {
    const decoded = jwtDecode(token);
    console.log("Decoded Token:", decoded);
    const adminIdFromToken = decoded.adminId;
    const { adminid: adminIdFromParams } = useParams();
    console.log("Admin ID from Token:", adminIdFromToken);
    console.log("Admin ID from Params:", adminIdFromParams);
    if (adminIdFromToken !== parseInt(adminIdFromParams, 10)) {
      console.log("Unauthorized access detected!");
      return <h1>Unauthorized Access</h1>;
    }
    return children;
  } catch (error) {
    console.error("Error decoding token or invalid token:", error);
    return <Navigate to="/adminlogin" />;
  }
};


export default App

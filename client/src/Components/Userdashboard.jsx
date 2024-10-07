import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Userdashboard = () => {
  const [data, setData] = useState({ name: "", email: "" });
  const [update, setUpdate] = useState(false);
  const [updatedata, setUpdatedata] = useState({ name: "", email: "" });
  const token = localStorage.getItem("userlogintoken");

  const { id } = useParams();

  // Fetch user data when component mounts
  useEffect(() => {
    getSingleUser();
  }, []); // Only run once when the component mounts

  // Sync updatedata with fetched user data
  useEffect(() => {
    if (data) {
      setUpdatedata({
        name: data.name || "",
        email: data.email || ""
      });
    }
  }, [data]); // Run this effect when 'data' changes

  const handleChange = (e) => {
    setUpdatedata({ ...updatedata, [e.target.name]: e.target.value });
  };

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
      setData(result.data); // Setting fetched data
    } catch (error) {
      alert(error.message);
    }
  };

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
        throw new Error("Some issue occurred");
      }

      const result = await res.json();

      // Immediately update the state with new data
      setData({ name: updatedata.name, email: updatedata.email });

      alert("Updated Successfully");
      setUpdate(false);

      // Optional: Adding a slight delay to ensure server is updated before fetching again
      setTimeout(() => {
        getSingleUser(); // Fetch the updated user data
      }, 300); // Adjust the delay as necessary

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className='userdash'>
      {update ? (
        <form onSubmit={handleUpdateClick} className='updateform'>
          <div className='updateinp'>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              value={updatedata.name}
              onChange={handleChange}
            />
          </div>
          <div className='updateinp'>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              value={updatedata.email}
              onChange={handleChange}
            />
          </div>
          <button type='submit'>Update Data</button>
        </form>
      ) : (
        <div className="details">
          <h1>Welcome {data.name}</h1>
          <button className='links' onClick={() => setUpdate(true)}>Update</button>
        </div>
      )}
    </div>
  );
};

export default Userdashboard;

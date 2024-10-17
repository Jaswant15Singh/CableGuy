import React from 'react'
import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer>
      <h1><Link to="/" className='links'>CableGuy</Link></h1>
      {/* <ul>
                <li><Link className='links' to='/'>Home</Link></li>
                <li><Link className='links' to='/'>Login</Link></li>
                <li><Link className='links' to='/'>Logout</Link></li>
                <li><Link className='links' to='/'>Admin Login</Link></li>
            </ul> */}
    </footer>
  )
}

export default Footer

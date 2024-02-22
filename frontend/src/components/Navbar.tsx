import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='navbar'>
        <ul>
            <li>Home</li>
            <li>Manage Todo</li>
            <li>All Todos</li>
            <li>Login</li>
        </ul>
    </div>
  )
}

export default Navbar
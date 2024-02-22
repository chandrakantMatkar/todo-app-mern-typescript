import React from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { AppDispatch } from '../app/store'
import { logout } from '../features/userSlice'
import { clearItems } from '../features/todoSlice'

const Logout = () => {
    const dispatch = useDispatch<AppDispatch>()
  return (
    <div>  <Link to='/login'><button className='logout-button' onClick={()=>{
        dispatch(logout());
        dispatch(clearItems());
    }}>Log out</button></Link> </div>
  )
}

export default Logout
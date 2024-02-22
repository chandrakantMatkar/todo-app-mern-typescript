import React from 'react'
import ManageItem from '../components/ManageItem'
import { useLocation } from 'react-router-dom'

const ManageItemScreen = () => {
//   const {state} = useLocation();
//   const {_id, new} = state
  return (
    <div>
        <ManageItem/>
    </div>
  )
}

export default ManageItemScreen
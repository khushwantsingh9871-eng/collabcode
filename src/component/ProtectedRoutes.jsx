import React, { Children, useState } from 'react'
// import Login from './Login'
// import { useNavigate } from 'react-router-dom'
import {Navigate} from 'react-router-dom'
import { useContext } from 'react'
import UserContext from '../context/userContext'

function ProtectedRoutes({ children }) {
//   const navigate = useNavigate()
  const {user} = useContext(UserContext)
    
    if(!user){
        return <Navigate to='/' replace/>
    }

  return children
}

export default ProtectedRoutes

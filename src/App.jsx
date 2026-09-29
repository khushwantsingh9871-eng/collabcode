import { useContext, useState } from 'react'
import './firebase/firebase.js'
import './App.css'
import Login from './component/Login.jsx'
import Navbar from './component/Navbar.jsx'
import UserContext from './context/userContext.jsx'
import { Routes,Route } from 'react-router-dom'
import ProtectedRoutes from './component/ProtectedRoutes.jsx'
function App() {

  const {user} = useContext(UserContext)

  return (
    <div className=''>

      <Routes>
        <Route path='/' element={<Login />}/>
        <Route path='/Navbar' element={
          <ProtectedRoutes>
          <Navbar/>
          </ProtectedRoutes>}/>

      </Routes>
      
    </div>
  )
}

export default App

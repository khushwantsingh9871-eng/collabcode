import { signInWithPopup, signInWithRedirect } from 'firebase/auth'
import React from 'react'
import { useContext } from 'react';
import UserContext from '../context/userContext'
import {auth,provider} from '../firebase/firebase'
import { useNavigate } from "react-router-dom";
function Login() {

  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const logins = ['Continue with Google','Apple',]

  async function google(){
    let data = await signInWithPopup(auth,provider)
    // console.log(data._tokenResponse.displayName)
    // setUser(data._tokenResponse);
    setUser(data._tokenResponse.displayName)
    localStorage.setItem('user',JSON.stringify(data._tokenResponse.displayName))
    navigate('/Navbar')
  }

  function methodLogin(name){
    switch(name){
      case 'Continue with Google':
        google()
        console.log('Google')
        break

      case 'Apple':
        console.log('Apple')
        break  

    }
  }

  return (

    <div className='w-screen h-screen flex justify-center items-center '>
          <div className='relative border flex flex-col justify-center items-center  rounded-3xl w-[30%] h-[65%] gap-4'>
            <div className='text-5xl font-thin'>
              <h1>LOGIN</h1> 
            </div>

            {/* <div className='border flex justify-center items-center hover:bg-slate-200 rounded-2xl font-extralight text-2xl w-[70%] h-[10%]'>
              <h1>Continue with Google</h1>
            </div>

            <div className='border flex justify-center items-center hover:bg-slate-200 rounded-2xl font-extralight text-2xl w-[70%] h-[10%]'>
              <h1>Apple</h1>
            </div> */}
            {logins.map((name)=>(
              <div key={name} className='border flex justify-center  items-center hover:bg-slate-200 rounded-2xl font-extralight text-2xl w-[70%] h-[10%]' onClick={()=>methodLogin(name)}>
                  {name}
              </div>
            ))}

            
          </div>

          <div className='absolute -z-10  shadow-gray-500  animate-pulse ease-in-out  shadow-2xl  rounded-3xl w-[30%] h-[65%] '> 
          </div>
        
      
    </div>
  )
}

export default Login

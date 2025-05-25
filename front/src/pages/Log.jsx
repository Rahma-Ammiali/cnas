import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import logo from '../assets/logo.png'

const Log = () => {
  const [numSecurite, setNumSecurite] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    console.log('numSecurite:', numSecurite);  // Log values before sending
    console.log('password:', password);
    e.preventDefault();
    axios.post('http://localhost:5000/login',{numSecurite,password})
    .then(res=>
      {console.log(res.data)
    if(res.data.message === "Logged in successfully"){
      navigate("/Acceuil");

    }
    else{
      alert("wrong password or number ")
      console.log("login failed ", res.data)
    }
  })
    .catch(err=>console.log(err))
    // navigate("/Acceuil");
  }

  return (
    <>
      <div className="w-[100vw] h-[100vh] items-center justify-center flex">
        <form onSubmit={handleSubmit} className='flex flex-col gap-6 justify-center w-[30%] border-2 border-[white] p-10 rounded-md shadow-2xl'>
          <div className='flex items-center justify-center gap-6'>
            <img src={logo} className='w-20' alt="Logo" />
            <h1 className='text-[55px] text-[#006DB8] text-center'>Bonjour !</h1>
          </div>
          
          <input 
            type="text"
            placeholder='Numéro de sécurité'
            value={numSecurite}
            onChange={(e) => setNumSecurite(e.target.value)}
            required
            className='w-[100%] border-2 border-[#00428C] p-4 rounded-md focus:outline-none focus:border-[#006DB8]'
          />
          
          <input
            type="password"
            placeholder='Mot de passe'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className='w-[100%] border-2 border-[#00428C] p-4 rounded-md focus:outline-none focus:border-[#006DB8]'
          />
          
          <button 
            type='submit' 
            className='bg-[#00428C] text-[20px] text-white w-[70%] rounded-md p-3 mx-auto cursor-pointer hover:bg-[#006DB8] transition-colors'
          >
            Entrer
          </button>
        </form>
      </div>
    </>
  )
}

export default Log
import React, { useState } from 'react'
import log from "../assets/log.png"
import { useNavigate } from 'react-router-dom'
const Log = () => {
  const [num,setNum]=useState("")
  const [password,setPassword]=useState("")
  const navigate= useNavigate()
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/Home");
  }

  return (
    <div className='w-[100vw]  flex flex-row'>
      <div className="w-[50vw] h-[100vh] items-center justify-center flex">
        
        <form onSubmit={handleSubmit} className='flex flex-col gap-6 justify-center w-[45%] '>
        <h1 className='text-[55px] text-[#006DB8] text-center'>Bonjour ! </h1>
          <input 
          type="text"
          placeholder='Num'
          value={num}
          onChange={(e)=>setNum(e.target.event)}
          required
          className='w-[100%] border-2 border-[#00428C] p-4 rounded-md focus:outline-none focus:border-[#006DB8]'
           />
           <input
           type="password"
           placeholder='Mot de passe'
           value={password}
           onChange={(e)=>setPassword(e.target.event)}
           required
           className='w-[100%] border-2 border-[#00428C] p-4 rounded-md focus:outline-none focus:border-[#006DB8]'
           />
           <button type='submit' 
           className='bg-[#00428C] text-[20px] text-white w-[70%] rounded-md p-3 mx-auto cursor-pointer'
           >Entrer</button>
        </form>
      </div>
      <div className="w-[50vw] bg-[#00428C] rounded-bl-[70%]  relative">
        <img src={log} 
        alt="login picture"
        className='top-[25%] w-[90%] absolute '
         />

      </div>
    </div>
  )
}

export default Log
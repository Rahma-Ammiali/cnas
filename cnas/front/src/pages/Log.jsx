import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import logo from '../assets/logo.png'
import { FaUserAlt, FaLock } from 'react-icons/fa'

const Log = () => {
  const [numSecurite, setNumSecurite] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    console.log('numSecurite:', numSecurite);
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
    .catch(err=>{
      console.log(err)
      alert("wrong password or number ")
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#f0f7ff] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(8,_112,_184,_0.2)] p-8">
          <div className="flex flex-col items-center mb-8">
            <img 
              src={logo} 
              alt="Logo" 
              className="w-32 h-32 object-contain mb-6"
            />
            <h1 className="text-3xl font-bold text-center">
              <span className="bg-gradient-to-r from-[#00428C] to-[#006DB8] text-transparent bg-clip-text">
                Connexion
              </span>
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-[#00428C]/70 font-medium block">
                Numéro de sécurité
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={numSecurite}
                  onChange={(e) => setNumSecurite(e.target.value)}
                  className="
                    w-full px-6 py-4 bg-[#DAEAF4] rounded-lg
                    text-[#00428C] placeholder-[#00428C]/50
                    focus:outline-none focus:ring-2 focus:ring-[#006DB8]
                    transition-all duration-300
                    pl-12
                  "
                  placeholder="Entrez votre numéro de sécurité"
                />
                <FaUserAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00428C]/50" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[#00428C]/70 font-medium block">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="
                    w-full px-6 py-4 bg-[#DAEAF4] rounded-lg
                    text-[#00428C] placeholder-[#00428C]/50
                    focus:outline-none focus:ring-2 focus:ring-[#006DB8]
                    transition-all duration-300
                    pl-12
                  "
                  placeholder="Entrez votre mot de passe"
                />
                <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00428C]/50" />
              </div>
            </div>

            <button
              type="submit"
              className="
                w-full px-6 py-4 rounded-lg
                bg-[#00428C] text-white
                hover:bg-[#006DB8]
                transition-all duration-300
                transform hover:scale-105
                font-medium
              "
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Log
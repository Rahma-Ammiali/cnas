import React, {useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { FaUserAlt, FaLock } from 'react-icons/fa'

const Log = () => {
  const [num_agent, setNumAgent] = useState("")
  const [password, setPassword] = useState("")
  const [error,setError]=useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("formulaire soumis!")
    setError("")
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    try{
      const res = await fetch('http://localhost:5000/api/login',{
        method:"POST",
        headers:{"Content-Type" : "application/json"},
        body: JSON.stringify({
          num_agent:num_agent.trim(),
          password:password.trim()}),
      });
      console.log("réponse brute : ",res)
      const data = await res.json();
      console.log("donnees recues : ",data)
      if (!res.ok){
        setError(data.message || "login failed");
        return ;
      }
      if(res.ok){
        localStorage.setItem("token",data.token);
      localStorage.setItem("user",JSON.stringify({
        role:data.user.role,
        nom:data.user.nom,
      }));
      navigate("/acceuil");

      }
      
      switch(data.user.role){
        case "admin":
        case "directrice" : 
        case "secretaire":
        case "educatrice" : 
        case "educatrice en chef" :
        case "econome" : 
        case "agent_cnas" : 
          await new Promise(resolve => setTimeout(resolve,100));
          
          navigate("/acceuil");
          break ; 
        default : 
          navigate("/");
      }
    }catch (err) {
      setError("erreur reseau");
    }
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
                Numéro d'agent
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={num_agent}
                  onChange={(e) => setNumAgent(e.target.value)}
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
              className={`
                w-full px-6 py-4 rounded-lg
                bg-[#00428C] text-white
                hover:bg-[#006DB8]
                transition-all duration-300
                transform hover:scale-105
                font-medium `}
            >
             Se connecter
            </button>
            {error && <p style = {{color : "red"}} >{error}</p>}
          </form>
        </div>
      </div>
    </div>
  )
}

export default Log
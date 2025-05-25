import React, { useState } from 'react'
import Side from '../components/Side'
import { FaRegEye ,FaRegEyeSlash  } from "react-icons/fa";

const Utilisateur = () => {
  const [showPassword,setShowPassword] = useState(false);
  const [formData,setFormData] = useState({
    nom:'',
    numAgent:'',
    role:'',
    password:''
  })
  const handleChange = ({target : {name,value}}) =>{
    setFormData(prev =>({
      ...prev,
      [name]:value
    }))
  }
  const handleSubmit= async (e) =>{
    e.preventDefault();
    try{
      const response = await fetch('http://localhost:5000/api/utilisateurs/ajouter',{
        method:'POST',
        headers : {
          'Content-Type' : 'application/json'
        },
        body:JSON.stringify(formData)
      })
      if(response.ok){
        alert("utilisateur ajouté avec succés !")
        setFormData({nom:'',numAgent:'',role:'',password:''});
      }else{
        const errorData = await response.json();
        alert("erreur lors de l'ajout de l'utilisateur ")
      }
    }catch(error){
      console.error("erreur reseau : ",error);
      alert("une erreur s'est produite . verifie ta connexion ")
    }
  }

  return (
    <div>
        <Side>
          <div className='w-[100%] h-[100%] flex justify-center items-center'>
            <div className='w-[60%] h-full shadow-2xl rounded-xl p-8 '>
              <h1 className='font-bold text-center text-2xl text-[#00428C]'>Ajouter un nouveau utilisateur : </h1>
                <form onSubmit={handleSubmit} className='flex flex-col gap-6 relative '> 
                   <div className='flex items-center justify-between mt-6'>
                    <label htmlFor="nom" className='text-[#00428C] font-bold text-2xl'>Nom :</label>
                    <input 
                    type="text"
                    name="nom"
                    value={formData.nom}
                    required
                    onChange={handleChange}
                     className='bg-[#DAEAF4] w-[70%] p-4 rounded-md focus:outline-none focus:border-[#006DB8]' 
                      />
                   </div>
                   <div className='flex items-center justify-between'>
                    <label 
                    htmlFor="num_agent"
                    className='text-[#00428C] font-bold text-2xl'>num d'agent :</label>
                    <input 
                    type="text"
                    name="numAgent"
                    value={formData.numAgent}
                    required
                    onChange={handleChange}
                    className='bg-[#DAEAF4] w-[70%] p-4 rounded-md focus:outline-none focus:border-[#006DB8]' 
                     />
                   </div>
                   <div className='flex items-center justify-between'>
                    <label htmlFor="role" className='text-[#00428C] font-bold text-2xl'>role :</label>
                    <select 
                    name="role"
                    value={formData.role}
                    className='bg-[#DAEAF4] w-[70%] p-4 rounded-md focus:outline-none focus:border-[#006DB8]' 
                    onChange={handleChange}>
                      <option value="">-- choisir un role --</option>
                      <option value="directrice">Directrice</option>
                      <option value="educatrice">Educatrice</option>
                      <option value="educatrice_en_chef">Educatrice en chef</option>
                      <option value="secretaire">Secrétaire</option>
                      <option value="econome">Econome</option>
                      <option value="agent_cnas">Agent Cnas</option>
                      <option value="admin">Admin</option>
                    </select>
                    
                   </div>
                   <div className='flex items-center justify-between'>
                    <label htmlFor="mot_de_passe" className='text-[#00428C] font-bold text-2xl'>Mot de passe :</label>
                    <input 
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    value={formData.password}
                    required
                    onChange={handleChange}
                    className=' relative bg-[#DAEAF4] w-[70%] p-4 rounded-md focus:outline-none focus:border-[#006DB8]' 
                    
                     />
                     <span className='cursor-pointer absolute right-5' onClick={ () => setShowPassword(!showPassword)}> {showPassword ?  <FaRegEye />:<FaRegEyeSlash />  }</span>
                   </div>
                   <button type='submit' className='absolute right-5 top-95 bg-[#00428C] text-[white] py-2 px-4 rounded-lg cursor-pointer'>Enregistrer</button>
                   <button onClick={() => setFormData({nom:'',numAgent:'',role:'',password:''})} className='absolute right-40 top-95 bg-[gray] text-[white] py-2 px-4 rounded-lg cursor-pointer'>Annuler</button>
                </form>
            </div>
            </div>
        </Side>
    </div>
  )
}

export default Utilisateur
import axios from 'axios';
import React, { useState } from 'react'
import { CiSearch } from "react-icons/ci";

const Etape1 = ({nextStep,setFormData,formData}) => {
    const [numSecurite,setNumSecurite] = useState("");
    const [enfantSelectionne , setEnfantSelectionne] = useState(null);
    const [enfants , setEnfants] = useState([]);
    const calculerAge = (date_naissance) =>{
        const birthDate = new Date(date_naissance);
                if (isNaN(birthDate.getTime())){
                    console.error("date de naissance invalide :",date_naissance);
                    return null;
                }
                const adjustedDate = new Date(
                    birthDate.getUTCFullYear(),
    
                    birthDate.getUTCMonth(),
                    birthDate.getUTCDate()
                )
                const today = new Date();
                let age = today.getFullYear() - adjustedDate.getFullYear();
                const monthDiff= today.getMonth()-adjustedDate.getMonth();
                if(monthDiff <0 || (monthDiff === 0 && today.getDate() <adjustedDate.getDate())){
                    age--;
                }
                return age;
      }
    const rechercheEnfants = async () =>{
        try{
            const response = await fetch(`http://localhost:5000/api/enfant/${numSecurite}`);
            const data = await response.json();
            setEnfants(data)
            console.log("Fetched Data:", data);
        }catch(error){
            console.error("erreur lors de la recherche" , error)
        }
            

    }
    const  handleSelect = (child) =>{
       setEnfantSelectionne(child);
    };
    const handleNext=()=>{
        setFormData((prev)=>({
            ...prev,
            numSecurite:numSecurite,
            enfantSelectionne:enfantSelectionne,
        }));
        nextStep();
    }

  return (
       
            <>

                <div className='flex justify_center m-4'>
                    <div className='bg-[white] border-2 border-[#00428C] rounded flex justify-between p-2 w-[80%] '>
                    <input type="text"
                        name="search" 
                        placeholder='num de securite '
                        value={numSecurite}
                        onChange={(e) => setNumSecurite(e.target.value)}
                        className='w-[100%] focus:outline-none focus:border-[#006DB8]' />

                    <button onClick={rechercheEnfants}
                        className='cursor-pointer'>
                            <CiSearch className='w-6 h-6' />
                        </button>
                    </div>
                    </div>
                       <ul>
                        {enfants.map((child)=>(
                            <li key={child.id}
                            className={`w-[30%] rounded-lg p-2 m-4 text-white cursor-pointer transition-all duration-300 transform ${enfantSelectionne === child ? 'bg-[#00428C] shadow-md hover:bg-[#003366]' : 'bg-[#006DB8] shadow-sm hover:bg-[#005A9E]'} hover:shadow-xl hover:-translate-y-1 active:scale-95 active:shadow-inner active:bg-[#002244] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                            onClick={()=> handleSelect(child)}>
                                <p>Nom : {child.nom} </p> 
                                <p>Prénom : {child.prenom}</p>
                                <p>Age : {calculerAge(child.date_naissance)}</p>
                                
                            </li>
                            ))}
                        </ul>
                        {enfantSelectionne && (
                            <button onClick={handleNext}
                            className='absolute right-15 bottom-15 bg-[#00428C] text-[white] py-3 px-5 rounded-md cursor-pointer'>suivant</button>
                        )}
                                
  </>)
}


export default Etape1
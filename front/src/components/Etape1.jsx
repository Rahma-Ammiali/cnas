import axios from 'axios';
import React, { useState } from 'react'
import { CiSearch } from "react-icons/ci";

const Etape1 = ({nextStep,setFormData,formData}) => {
    const [numSecurite,setNumSecurite] = useState("");
    const [enfantSelectionne , setEnfantSelectionne] = useState(null);
    const [enfants , setEnfants] = useState([]);
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
                        {enfants.map((child , index)=>(
                            <li key={index}
                            className={` w-[40%] rounded p-2 m-4 text-[white] cursor-pointer ${enfantSelectionne===child ? 'bg-[#00428C]' :'bg-[#006DB8]'  }`}
                            onClick={()=> handleSelect(child)}>
                                {child.nom} {child.prenom} {child.date_naissance}
                                
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
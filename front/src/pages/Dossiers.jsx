import React, { useEffect,useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Side from '../components/Side'
const Dossiers = () => {
  const [classeSelectionnee,setClasseSelectionnee] = useState('Tous');
  const [dossiers,setDossiers] = useState([]);
  const navigate=useNavigate();
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
  
  useEffect(()=>{
    fetch("http://localhost:5000/api/Dossiers/valides")
    .then(res => res.json())
    .then(data =>setDossiers(data))
    .catch((err) => console.error(err));
  },[])

  const handleDetails =  (id) =>{
    navigate(`/dossiers/${id}`)
  }
  
  
  const getFilteredEnfants = () =>{
    if(classeSelectionnee === 'Tous'){
      return dossiers;
    }
    return dossiers.filter(e => e.classe === classeSelectionnee);
  }
  

  return (
    <Side >
    <div className=' relative'>
      <h2 className='text-[35px] text-[#00428C] font-bold mb-4'>validation des preinscriptions</h2>
      
      <div>
        <div className='w-[100%] flex gap-5 mb-3 '> 
          <button
          className={`${classeSelectionnee === 'Tous' ? 'text-[#006DB8] font-bold text-xl decoration-solid underline' : 'text-gray-500 text-xl'} cursor-pointer`}
          onClick={()=> setClasseSelectionnee('Tous')}
          >
            Tous
          </button>
          {['Petite section','Moyenne section','Grande section'].map(classe =>(
            <button
            key={classe}
            className={`${classeSelectionnee === classe ? 'text-[#006DB8] font-bold text-xl decoration-solid underline' : 'text-gray-500 text-xl'} cursor-pointer`}
            onClick={()=>setClasseSelectionnee(classe)}
            >
              {classe}
            </button>
          ))}
        </div>
      </div>

      <div className='overflow-hidden'>
      <div className='max-h-[60vh] overflow-y-auto border-gray-200 border rounded-xl '>
      <table className=' w-full' >
          <tr className=' border-gray-200 border shadow-md bg-[#FEFDFF]'>
            <th className='w-1/6  px-4 py-2 '>nom</th>
            <th className='w-1/6 px-4 py-2 '>prenom</th>
            <th className='w-1/6 px-4 py-2 '>age</th>
            <th className='w-1/6 px-4 py-2 '>classe</th>
            <th className='w-1/6 px-4 py-2 '>Sexe</th>

            <th className='w-1/6 px-4 py-2 '>action</th>
          </tr>
        <tbody>
          
            {getFilteredEnfants().map((e) => (
              <tr className='border border-gray-200 w-[100%]   '>
                <td className='w-1/6 px-4 py-2 text-center '>{e.nom}</td>
                <td className='w-1/6 px-4 py-2 text-center '>{e.prenom}</td>
                <td className='w-1/6 px-4 py-2 text-center '>{calculerAge(e.date_naissance)}</td>
                <td className='w-1/6 px-4 py-2 text-center '>{e.classe}</td>
                <td className='w-1/6 px-4 py-2 text-center '>{e.sexe}</td>
                <td className='w-1/6 px-4 py-2 text-center'>
                  <button 
                  className='bg-blue-400 hover:bg-blue-500 text-white px-3 py-1 rounded shadow-sm cursor-pointer'
                  onClick={()=>handleDetails(e.id)}>
                        voir plus
                  </button>
                  </td>
                
                
              </tr>
            ))
          }
        </tbody>
      </table>
      </div>
      </div>
      
    </div>
    </Side>
  )
}

export default Dossiers
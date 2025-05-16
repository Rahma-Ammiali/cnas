import React, { useEffect,useState } from 'react'
import Side from '../components/Side'
import { useNavigate } from 'react-router-dom';
import DetailsModal from '../components/DetailsModal';
const EnAttente = () => {
  const [preinscription,SetPreinscription] = useState([]);
  const [status,setStatus] = useState({});
  const [selectedId,setSelectedId]=useState(null)
  const navigate = useNavigate();
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
    fetch("http://localhost:5000/api/preinscription/nonValidees")
    .then(res => res.json())
    .then(data =>{SetPreinscription(data);
    const initialStatus = {};
    data.forEach(element => {
      initialStatus[element.id_preinscription] = "non validé"
    });
    setStatus(initialStatus);})
    .catch((err) => console.error(err));
  },[])

  const handleValidation = async (id_preinscription,classe) =>{
    console.log("validation demandée pour ",id_preinscription,classe)
    fetch("http://localhost:5000/api/preinscription/valider",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body:JSON.stringify({id_preinscription,classe}),
    })
    .then((res) => res.json())
    .then((data) =>{
      if (data.status === "validee"){
        setStatus((prev) =>({ ...prev,[id_preinscription]:"validé"}));
      }else if (data.status === "saturee"){
        setStatus(prev => ({...prev,[id_preinscription]:"saturé"}));
      }
    })
    .catch(err =>{
      console.log(err)
    })
  }
  const handleVoirPlus = (id) =>{
    setSelectedId(id);
  }
  

  return (
    <Side >
    <div className='p-4 relative'>
      <h2 className='text-[35px] text-[#00428C] font-bold mb-4'>validation des preinscriptions</h2>
      <table className=' w-full ' >
          <tr className=' border-gray-200 border shadow-md bg-[#FEFDFF]'>
            <th className='w-1/6  px-4 py-2 '>nom</th>
            <th className='w-1/6 px-4 py-2 '>prenom</th>
            <th className='w-1/6 px-4 py-2 '>age</th>
            <th className='w-1/6 px-4 py-2 '>classe</th>
            <th className='w-1/6 px-4 py-2 '>statut</th>
            <th className='w-1/6 px-4 py-2 '>Voir plus</th>
            <th className='w-1/6 px-4 py-2 '>action</th>
          </tr>
        <tbody>
          {
            preinscription.map((e) => (
              <tr className='border-b-4 border-b-[white] w-[100%] border-b border-gray-200 shadow-md  '>
                <td className='w-1/6 px-4 py-2 text-center '>{e.nom}</td>
                <td className='w-1/6 px-4 py-2 text-center '>{e.prenom}</td>
                <td className='w-1/6 px-4 py-2 text-center '>{calculerAge(e.date_naissance)}</td>
                <td className='w-1/6 px-4 py-2 text-center '>{e.classe}</td>
                <td className='w-1/6 px-4 py-2 text-center '>{status[e.id_preinscription]}</td>
                <td className='w-1/6 px-4 py-2 text-center'>
                  <button 
                  className='bg-blue-400 hover:bg-blue-500 text-white px-3 py-1 rounded shadow-sm '
                  onClick={()=>handleVoirPlus(e.id_preinscription)}>
                        voir plus
                      </button></td>
                <td className='w-1/6 px-4 py-2 text-center border-b-4 border-[white]'>
                  {
                    preinscription.valide ? (
                      <button className='bg-gray-500 text-white px-3 py-1 rounded shadow-sm cursor-not-allowed'>
                        saturé
                      </button>
                    ):(
                      <div>
                      <button 
                      className='bg-green-400 hover:bg-green-500 text-white px-3 py-1 rounded shadow-sm disabled:opacity-50'
                      onClick={() => handleValidation(e.id_preinscription , e.classe)}
                      disabled={status[e.id_preinscription] !== "non validé"}>
                        valider
                      </button>
                      </div>
                    )
                  }
                </td>
                
              </tr>
            ))
          }
        </tbody>
      </table>
      {selectedId && (
        <DetailsModal id={selectedId} onClose={()=> setSelectedId(null)} />
      )}
    </div>
    </Side>
  )
}

export default EnAttente
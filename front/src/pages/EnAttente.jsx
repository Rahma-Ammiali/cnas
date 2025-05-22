import React, { useEffect,useState } from 'react'
import Side from '../components/Side'
import DetailsModal from '../components/DetailsModal';
const EnAttente = () => {
  const [classeSelectionnee,setClasseSelectionnee] = useState('Tous');
  const [preinscription,SetPreinscription] = useState([]);
  const [status,setStatus] = useState({});
  const [selectedId,setSelectedId]=useState(null)
  const [placesRestantes,setPlacesRestantes] = useState([]);
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
          fetchPlacesRestantes();
      }else if (data.status === "saturee"){
        setStatus(prev => ({...prev,[id_preinscription]:"saturé"}));
        fetchPlacesRestantes();
      }
    })
    .catch(err =>{
      console.log(err)
    })
  }
  const handleVoirPlus = (id) =>{
    setSelectedId(id);
  }
  const fetchPlacesRestantes= ()=>{
    fetch("http://localhost:5000/api/preinscription/places")
    .then(res=>res.json())
    .then(data=>{
      setPlacesRestantes(data);
    })
    .catch(err=>{
      console.error("erreur lors de la recuperation des places restantes :",err)
    })
  }
  useEffect(()=>{
    fetchPlacesRestantes();
  },[]);
  const getFilteredPreinscriptions = () =>{
    if(classeSelectionnee === 'Tous'){
      return preinscription;
    }
    return preinscription.filter(e => e.classe === classeSelectionnee);
  }
  

  return (
    <Side >
    <div className=' relative'>
      <h2 className='text-[35px] text-[#00428C] font-bold mb-4'>validation des preinscriptions</h2>
      <div className=' w-[80vw] '>
      <div className=' flex justify-between'>
        {placesRestantes.map(classe =>(
          <div className='border border-gray-200 shadow-md bg-[white] w-[20vw] h-[6vw] shadow-md rounded-xl p-4 mb-4 text-[#006DB8] font-bold'>
            <h3 className=''>{classe.nom_classe}</h3>
            <p>{classe.nbr_places} places restantes</p>
            
          </div>
        ))}
        </div>
      </div>
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
            <th className='w-1/6 px-4 py-2 '>statut</th>
            <th className='w-1/6 px-4 py-2 '>Voir plus</th>
            <th className='w-1/6 px-4 py-2 '>action</th>
          </tr>
        <tbody>
          
            {getFilteredPreinscriptions().map((e) => (
              <tr className='border border-gray-200 w-[100%]   '>
                <td className='w-1/6 px-4 py-2 text-center '>{e.nom}</td>
                <td className='w-1/6 px-4 py-2 text-center '>{e.prenom}</td>
                <td className='w-1/6 px-4 py-2 text-center '>{calculerAge(e.date_naissance)}</td>
                <td className='w-1/6 px-4 py-2 text-center '>{e.classe}</td>
                <td className='w-1/6 px-4 py-2 text-center '>{status[e.id_preinscription]}</td>
                <td className='w-1/6 px-4 py-2 text-center'>
                  <button 
                  className='bg-blue-400 hover:bg-blue-500 text-white px-3 py-1 rounded shadow-sm cursor-pointer'
                  onClick={()=>handleVoirPlus(e.id_preinscription)}>
                        voir plus
                  </button>
                  </td>
                <td className='w-1/6 px-4 py-2 text-center '>
                  {
                    status[e.id_preinscription] === "validé" ?(
                      <button 
                      className=' text-white px-3 py-1 rounded shadow-sm  bg-green-300 cursor-not-allowed '
                      >
                        validé
                      </button>
                    ):status[e.id_preinscription] === "saturé" ?(
                      <button 
                      className=' text-white px-3 py-1 rounded shadow-sm opacity-50 bg-gray-800 cursor-not-allowed'
                      >
                        saturé
                      </button>
                    ) : (
                      <button className='bg-green-500 text-white px-3 py-1 rounded shadow-sm cursor-pointer'
                      onClick={() => handleValidation(e.id_preinscription , e.classe)}>
                        valider
                      </button>
                    )
                  }
                </td>
                
              </tr>
            ))
          }
        </tbody>
      </table>
      </div>
      </div>
      {selectedId && (
        <DetailsModal id={selectedId} onClose={()=> setSelectedId(null)} />
      )}
    </div>
    </Side>
  )
}

export default EnAttente
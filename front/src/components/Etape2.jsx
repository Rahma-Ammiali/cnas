import React, { useEffect, useState } from 'react'

const Etape2 = ({nextStep , prevStep , formData}) => {
  const [parents,setParents] = useState(null)
  useEffect(()=>{
    const fetchParents = async ()=>{
      try{
        const response = await fetch(`http://localhost:5000/api/enfant/parents/${formData.enfantSelectionne.id}`)
        if(!response.ok){
          throw new Error('erreur lors de la recuperation des parents ')
        }
        const data = await response.json()
        setParents(data);
      }catch (error){
        console.log("erreur lors de la recuperation des parents ",error)
      }
    }
    fetchParents();
  } ,[formData.enfantSelectionne.id])
  return (
    <div className='p-6  flex flex-col gap-4'>
      <div className='flex justify-between'>
      <p> Nom : </p>
      <span className='py-1 px-2 bg-[white] border-2 border-[#006DB8] rounded-md inline-block w-[50%]'>{formData.enfantSelectionne?.nom}</span>
      </div>
      
      <div className='flex justify-between'>
      <p>prenom : </p>
      <span className='py-1 px-2 bg-[white] border-2 border-[#006DB8] rounded-md inline-block w-[50%]'>{formData.enfantSelectionne?.prenom}</span>
      </div>
      <div className='flex justify-between'>
      <p>date de naissance :</p>
      <span className='py-1 px-2 bg-[white] border-2 border-[#006DB8] rounded-md inline-block w-[50%]'>{formData.enfantSelectionne?.date_naissance}</span>
      </div>
      {parents ? (
        <div className='flex flex-col gap-4' >
        <div className='flex justify-between'>
        <p>Nom du Pere : </p>
        <span className='py-1 px-2 bg-[white] border-2 border-[#006DB8] rounded-md inline-block w-[50%]'>{parents.nom_pere}</span>
        </div>
        <div className='flex justify-between'>
        <p>Prénom du Pere : </p>
        <span className='py-1 px-2 bg-[white] border-2 border-[#006DB8] rounded-md inline-block w-[50%]'>{parents.prenom_pere}</span>
        </div>
        <div className='flex justify-between'>
        <p>Secteur d'activité du pere : </p>
        <span className='py-1 px-2 bg-[white] border-2 border-[#006DB8] rounded-md inline-block w-[50%]'>{parents.secteur_activite_pere}</span>
        </div>
        <div className='flex justify-between'>
        <p>Nom de la mere: </p>
        <span className='py-1 px-2 bg-[white] border-2 border-[#006DB8] rounded-md inline-block w-[50%]'>{parents.secteur_activite_mere}</span>
        </div>
        <div className='flex justify-between'>
        <p>Prénom de la mere : </p>
        <span className='py-1 px-2 bg-[white] border-2 border-[#006DB8] rounded-md inline-block w-[50%]'>{parents.prenom_mere}</span>
        </div>
        <div className='flex justify-between'>
        <p>Secteur d'activité de la mere : </p>
        <span className='py-1 px-2 bg-[white] border-2 border-[#006DB8] rounded-md inline-block w-[50%]'>{parents.secteur_activite_mere}</span>
        </div>
        </div>
      ) : 
      <p>chargement des données des parents </p>}
      <button 
        onClick={nextStep}
        className='absolute right-15 bottom-6 bg-[#00428C] text-[white] py-3 px-5 rounded-md cursor-pointer'>
          suivant
        </button>
        <button
        onClick={prevStep}
         className='absolute left-15 bottom-6 bg-[#00428C] text-[white] py-3 px-5 rounded-md cursor-pointer'
         >
        
          Previous

        </button>
    </div>
    
  )
}

export default Etape2
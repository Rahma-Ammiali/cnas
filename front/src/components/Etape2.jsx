import React, { useEffect, useState } from 'react'

const Etape2 = ({nextStep , prevStep , formData}) => {
  const [parents,setParents] = useState(null)
  useEffect(()=>{
    const fetchParents = async ()=>{
      try{
        const response = await fetch(`http://localhost:5000/api/parents/${formData.enfantSelectionne.id}`)
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
    <div className='w-full p-8 bg-white rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold text-[#00428C] mb-8'>Informations</h2>
      
      <div className='flex w-full gap-8'>
        {/* Child Information - Left Side */}
        <div className='flex-1 space-y-4 p-6 bg-gray-50 rounded-lg'>
          <h3 className='text-xl font-semibold text-[#006DB8] border-b pb-2 mb-4'>Enfant</h3>
          <div className='space-y-4'>
            <div className='grid grid-cols-3 items-center'>
              <p className='text-gray-700 font-medium col-span-1'>Nom :</p>
              <span className='py-2 px-4 bg-white border border-gray-300 rounded-lg text-gray-800 col-span-2'>{formData.enfantSelectionne?.nom}</span>
            </div>
            
            <div className='grid grid-cols-3 items-center'>
              <p className='text-gray-700 font-medium col-span-1'>Prénom :</p>
              <span className='py-2 px-4 bg-white border border-gray-300 rounded-lg text-gray-800 col-span-2'>{formData.enfantSelectionne?.prenom}</span>
            </div>
            
            <div className='grid grid-cols-3 items-center'>
              <p className='text-gray-700 font-medium col-span-1'>Date de naissance :</p>
              <span className='py-2 px-4 bg-white border border-gray-300 rounded-lg text-gray-800 col-span-2'>{formData.enfantSelectionne?.date_naissance}</span>
            </div>
          </div>
        </div>

        {/* Parents Information - Right Side */}
        {parents ? (
          <div className='flex-1 space-y-4 p-6 bg-gray-50 rounded-lg'>
            <h3 className='text-xl font-semibold text-[#006DB8] border-b pb-2 mb-4'>Parents</h3>
            <div className='space-y-4'>
              <div className='grid grid-cols-3 items-center'>
                <p className='text-gray-700 font-medium col-span-1'>Nom du Père :</p>
                <span className='py-2 px-4 bg-white border border-gray-300 rounded-lg text-gray-800 col-span-2'>{parents.nom_pere}</span>
              </div>
              
              <div className='grid grid-cols-3 items-center'>
                <p className='text-gray-700 font-medium col-span-1'>Prénom du Père :</p>
                <span className='py-2 px-4 bg-white border border-gray-300 rounded-lg text-gray-800 col-span-2'>{parents.prenom_pere}</span>
              </div>
              
              <div className='grid grid-cols-3 items-center'>
                <p className='text-gray-700 font-medium col-span-1'>Secteur d'activité :</p>
                <span className='py-2 px-4 bg-white border border-gray-300 rounded-lg text-gray-800 col-span-2'>{parents.secteur_activite_pere}</span>
              </div>
              
              <div className='grid grid-cols-3 items-center'>
                <p className='text-gray-700 font-medium col-span-1'>Nom de la mère :</p>
                <span className='py-2 px-4 bg-white border border-gray-300 rounded-lg text-gray-800 col-span-2'>{parents.nom_mere}</span>
              </div>
              
              <div className='grid grid-cols-3 items-center'>
                <p className='text-gray-700 font-medium col-span-1'>Prénom de la mère :</p>
                <span className='py-2 px-4 bg-white border border-gray-300 rounded-lg text-gray-800 col-span-2'>{parents.prenom_mere}</span>
              </div>
              
              <div className='grid grid-cols-3 items-center'>
                <p className='text-gray-700 font-medium col-span-1'>Secteur d'activité :</p>
                <span className='py-2 px-4 bg-white border border-gray-300 rounded-lg text-gray-800 col-span-2'>{parents.secteur_activite_mere}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className='flex-1 flex items-center justify-center p-6 bg-gray-50 rounded-lg'>
            <p className='text-gray-500'>Chargement des données des parents...</p>
          </div>
        )}
      </div>
      
      <div className='flex justify-between mt-8'>
        <button
          onClick={prevStep}
          className='bg-[#00428C] hover:bg-[#006DB8] text-white font-medium py-2 px-6 rounded-lg transition duration-200'
        >
          Précédent
        </button>
        <button 
          onClick={nextStep}
          className='bg-[#00428C] hover:bg-[#006DB8] text-white font-medium py-2 px-6 rounded-lg transition duration-200'
        >
          Suivant
        </button>
      </div>
    </div>
  )
}

export default Etape2
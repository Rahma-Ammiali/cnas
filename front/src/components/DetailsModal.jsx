import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

const DetailsModal = ({id,onClose}) => {
    const[details,setDetails] = useState(null)
    useEffect(()=>{
        if(!id) return;
        fetch(`http://localhost:5000/api/enAttente/${id}`)
        .then((res) => res.json())
        .then((data) =>{
            setDetails(data);
        })
        .catch((err) =>{
            console.error("erreur lors de la recuperation des details : ",err)
        })
    },[id])
    if(!id || !details) return null ; 
  return (
    <div className='w-[80vw] flex justify-center'>
    <div className='w-[70vw]  bg-[#F3FAFF] px-3 py-10 absolute top-7 rounded shadow-2xl border border-gray-200'>
        <button 
        className='right-20 absolute bg-blue-400 hover:bg-blue-500 text-white px-3 py-1 rounded shadow-sm '
        onClick={onClose}> Fermer </button>
        <div className='flex justify-between mx-15'>
            <div className='flex flex-col gap-1.5'>
                <h1 className='text-[25px] text-[#00428C] font-bold'>Information sur l'enfant et les parents : </h1>
                <h2 className='text-[15px] text-[black] font-bold '>infos enfant  : </h2>
                <p>Nom : {details.nom_enfant}</p>
                <p>prenom : {details.prenom_enfant}</p>
                <p>Date de naissance : {details.date_naissance}</p>
                <p>Classe : {details.classe}</p>
                <p>Handicap : {details.handicap ? `oui (${details.handicap_details})` : 'non' }</p>
                <p>Maladie chronique : {details.maladie ? `oui (${details.maladie_details})` : 'non' }</p>
            </div>
            <div className='mt-8 mr-20 flex flex-col gap-1.5'>
                <h2 className='text-[15px] text-[black] font-bold '>infos parents : </h2>
                <p>Tarif preferentiel : {details.tarif_preferentiel}</p>
                <p>Nom pere : {details.nom_pere} </p>
                <p>Prenom pere : {details.prenom_pere}</p>
                <p>Telephone pere : {details.telephone_pere }</p>
                <p>Numéro assurance : {details.num_assurance_pere}</p>
                <p>Secteur activité : {details.secteur_activite_pere || 'N/A' }</p>
                <p>Nom mere : {details.nom_mere} </p>
                <p>Prenom mere : {details.prenom_mere}</p>
                <p>Telephone mere : {details.telephone_mere || 'N/A'}</p>
                <p>Numéro assurance : {details.num_assurance_mere}</p>
                <p>Secteur activité : {details.secteur_activite_mere || 'N/A' }</p>
                <p>Assurance mere ou employeur : {details.assurance_mere_ou_employeur}</p>
                <p>Correspondant : {details.correspondant}</p>
                <p>Date depot : {details.date_depot}</p>
            </div>
        </div>
        
        
    </div>
    </div>
  )
}

export default DetailsModal
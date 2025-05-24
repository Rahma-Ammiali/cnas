// import React, { useEffect,useState } from 'react'
// import {useParams,useNavigate} from 'react-router-dom'
// import Side from '../components/Side'
// const DossiersDetails = () => {
//     const {id} = useParams();
//     const navigate = useNavigate();
//     const [dossier,setDossiers] = useState(null);
//     useEffect(()=>{
//         fetch(`http://localhost:5000/api/Dossiers/${id}`)
//             .then(res => res.json())
//             .then(data => setDossiers(data[0]))
//             .catch(err => console.error(err))
//     },[id])
//     if(!dossier) return <div> chargement ...</div>
//   return (
//     <Side>
//         <div>
//             <button 
//             onClick={()=>navigate(-1)}>
//                 Retour
//             </button>
//             <h1>
//                 dossier de {dossier.prenom} {dossier.nom}
//             </h1>
//             <div>
//                 <div>
//                     <h2>
//                         information de l'enfant
//                     </h2>
//                     <p>nom : {dossier.nom}</p>
//                     <p>prenom : {dossier.prenom}</p>
//                 </div>
//             </div>
//         </div>
//     </Side>
//     )
// }

// export default DossiersDetails
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Side from '../components/Side';

const DossierDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dossier, setDossier] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/dossiers/${id}`)
      .then(res => res.json())
      .then(data => setDossier(data[0])) // Prend le premier élément du tableau
      .catch(err => console.error(err));
  }, [id]);



  return (
    <Side>
      <div className="p-6">
        <button 
          onClick={() => navigate(-1)}
          className="mb-4 bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
        >
          Retour
        </button>

        <h1 className="text-2xl font-bold mb-6">Dossier de {dossier.prenom} {dossier.nom}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Section Enfant */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Informations de l'enfant</h2>
            <p><span className="font-medium">Nom:</span> {dossier.nom}</p>
            <p><span className="font-medium">Prénom:</span> {dossier.prenom}</p>
            <p><span className="font-medium">Date de naissance:</span> {dossier.date_naissance}</p>
            <p><span className="font-medium">Sexe:</span> {dossier.sexe}</p>
            <p><span className="font-medium">Classe:</span> {dossier.classe}</p>
            <p><span className="font-medium">Handicap:</span> {dossier.handicap ? `Oui (${dossier.handicap_details})` : 'Non'}</p>
            <p><span className="font-medium">Maladie chronique:</span> {dossier.maladie_chronique ? `Oui (${dossier.maladie_details})` : 'Non'}</p>
          </div>

          {/* Section Parents */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Informations des parents</h2>
            <div className="mb-4">
              <h3 className="font-medium">Mère</h3>
              <p>Nom: {dossier.nom_mere || 'N/A'}</p>
              <p>Prénom: {dossier.prenom_mere || 'N/A'}</p>
              <p>Téléphone: {dossier.telephone_mere || 'N/A'}</p>
            </div>
            <div>
              <h3 className="font-medium">Père</h3>
              <p>Nom: {dossier.nom_pere || 'N/A'}</p>
              <p>Prénom: {dossier.prenom_pere || 'N/A'}</p>
              <p>Téléphone: {dossier.telephone_pere || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </Side>
  );
};

export default DossierDetails;
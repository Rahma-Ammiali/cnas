import React, { useEffect, useState } from 'react'

const DetailsModal = ({id, onClose, context = 'enAttente'}) => {
    const [details, setDetails] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        if(!id) return;
        
        // Utiliser l'URL appropriée selon le contexte
        const url = context === 'dossiers' 
            ? `http://localhost:5000/api/dossiers/${id}`
            : `http://localhost:5000/api/enAttente/${id}`;

        fetch(url)
        .then((res) => res.json())
        .then((data) => {
            if (data.error) {
                setError(data.error);
                return;
            }
            setDetails(data);
        })
        .catch((err) => {
            console.error("Erreur lors de la récupération des détails : ", err);
            setError("Erreur lors de la récupération des détails");
        });
    }, [id, context]);

    if(!id || (!details && !error)) return null;

    if (error) {
        return (
            <div className='w-[80vw] flex justify-center'>
                <div className='w-[70vw] bg-[#F3FAFF] px-3 py-10 absolute top-7 rounded shadow-2xl border border-gray-200'>
                    <button 
                        className='right-20 absolute bg-blue-400 hover:bg-blue-500 text-white px-3 py-1 rounded shadow-sm'
                        onClick={onClose}>
                        Fermer
                    </button>
                    <div className='text-red-500 text-center'>
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    // Adapter l'affichage selon le contexte
    const displayData = context === 'dossiers' ? {
        nom_enfant: details.nom,
        prenom_enfant: details.prenom,
        date_naissance: details.date_naissance,
        classe: details.classe,
        handicap: details.handicap,
        handicap_details: details.handicap_details,
        maladie_chronique: details.maladie_chronique,
        maladie_details: details.maladie_details,
        nom_pere: details.nom_pere,
        prenom_pere: details.prenom_pere,
        telephone_pere: details.telephone_pere,
        nom_mere: details.nom_mere,
        prenom_mere: details.prenom_mere,
        telephone_mere: details.telephone_mere,
        tarif_preferentiel: details.tarif_preferentiel,
        assurance_mere_ou_employeur: details.assurance_mere_ou_employeur
    } : details;

    return (
        <div className='w-[80vw] flex justify-center'>
            <div className='w-[70vw] bg-[#F3FAFF] px-3 py-10 absolute top-7 rounded shadow-2xl border border-gray-200'>
                <button 
                    className='right-20 absolute bg-blue-400 hover:bg-blue-500 text-white px-3 py-1 rounded shadow-sm'
                    onClick={onClose}>
                    Fermer
                </button>
                <div className='flex justify-between mx-15'>
                    <div className='flex flex-col gap-1.5'>
                        <h1 className='text-[25px] text-[#00428C] font-bold'>Information sur l'enfant et les parents : </h1>
                        <h2 className='text-[15px] text-[black] font-bold'>Infos enfant : </h2>
                        <p>Nom : {displayData.nom_enfant}</p>
                        <p>Prénom : {displayData.prenom_enfant}</p>
                        <p>Date de naissance : {displayData.date_naissance}</p>
                        <p>Classe : {displayData.classe}</p>
                        <p>Handicap : {displayData.handicap ? `Oui (${displayData.handicap_details})` : 'Non'}</p>
                        <p>Maladie chronique : {displayData.maladie_chronique ? `Oui (${displayData.maladie_details})` : 'Non'}</p>
                    </div>
                    <div className='mt-8 mr-20 flex flex-col gap-1.5'>
                        <h2 className='text-[15px] text-[black] font-bold'>Infos parents : </h2>
                        <p>Tarif préférentiel : {displayData.tarif_preferentiel}</p>
                        <p>Nom père : {displayData.nom_pere}</p>
                        <p>Prénom père : {displayData.prenom_pere}</p>
                        <p>Téléphone père : {displayData.telephone_pere}</p>
                        <p>Nom mère : {displayData.nom_mere}</p>
                        <p>Prénom mère : {displayData.prenom_mere}</p>
                        <p>Téléphone mère : {displayData.telephone_mere || 'N/A'}</p>
                        <p>Assurance mère ou employeur : {displayData.assurance_mere_ou_employeur}</p>
                        {context === 'enAttente' && (
                            <>
                                <p>Correspondant : {displayData.correspondant}</p>
                                <p>Date dépôt : {displayData.date_depot}</p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetailsModal;
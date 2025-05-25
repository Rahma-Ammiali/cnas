import React, { useEffect, useState } from 'react'
import { IoClose } from 'react-icons/io5'

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
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-[0_10px_30px_rgba(8,_112,_184,_0.3)]">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-red-500">Erreur</h2>
                        <button 
                            onClick={onClose}
                            className="p-2 hover:bg-red-50 rounded-full transition-colors duration-200"
                        >
                            <IoClose className="w-6 h-6 text-red-500" />
                        </button>
                    </div>
                    <p className="text-red-500 text-center">{error}</p>
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 shadow-[0_10px_30px_rgba(8,_112,_184,_0.3)]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">
                        <span className="bg-gradient-to-r from-[#00428C] to-[#006DB8] text-transparent bg-clip-text">
                            Détails de la préinscription
                        </span>
                    </h2>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-[#00428C]/10 rounded-full transition-colors duration-200"
                    >
                        <IoClose className="w-6 h-6 text-[#00428C]" />
                    </button>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-[#00428C] mb-4">Informations de l'enfant</h3>
                            <div className="space-y-3">
                                <p className="flex items-center justify-between py-2 border-b">
                                    <span className="text-gray-600">Nom</span>
                                    <span className="font-medium">{displayData.nom_enfant}</span>
                                </p>
                                <p className="flex items-center justify-between py-2 border-b">
                                    <span className="text-gray-600">Prénom</span>
                                    <span className="font-medium">{displayData.prenom_enfant}</span>
                                </p>
                                <p className="flex items-center justify-between py-2 border-b">
                                    <span className="text-gray-600">Date de naissance</span>
                                    <span className="font-medium">{displayData.date_naissance}</span>
                                </p>
                                <p className="flex items-center justify-between py-2 border-b">
                                    <span className="text-gray-600">Classe</span>
                                    <span className="font-medium">{displayData.classe}</span>
                                </p>
                                <p className="flex items-center justify-between py-2 border-b">
                                    <span className="text-gray-600">Handicap</span>
                                    <span className="font-medium">{displayData.handicap ? `Oui (${displayData.handicap_details})` : 'Non'}</span>
                                </p>
                                <p className="flex items-center justify-between py-2 border-b">
                                    <span className="text-gray-600">Maladie chronique</span>
                                    <span className="font-medium">{displayData.maladie_chronique ? `Oui (${displayData.maladie_details})` : 'Non'}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-[#00428C] mb-4">Informations des parents</h3>
                            <div className="space-y-3">
                                <p className="flex items-center justify-between py-2 border-b">
                                    <span className="text-gray-600">Tarif préférentiel</span>
                                    <span className="font-medium">{displayData.tarif_preferentiel}</span>
                                </p>
                                <p className="flex items-center justify-between py-2 border-b">
                                    <span className="text-gray-600">Père</span>
                                    <span className="font-medium">{displayData.nom_pere} {displayData.prenom_pere}</span>
                                </p>
                                <p className="flex items-center justify-between py-2 border-b">
                                    <span className="text-gray-600">Téléphone père</span>
                                    <span className="font-medium">{displayData.telephone_pere}</span>
                                </p>
                                <p className="flex items-center justify-between py-2 border-b">
                                    <span className="text-gray-600">Mère</span>
                                    <span className="font-medium">{displayData.nom_mere} {displayData.prenom_mere}</span>
                                </p>
                                <p className="flex items-center justify-between py-2 border-b">
                                    <span className="text-gray-600">Téléphone mère</span>
                                    <span className="font-medium">{displayData.telephone_mere || 'N/A'}</span>
                                </p>
                                <p className="flex items-center justify-between py-2 border-b">
                                    <span className="text-gray-600">Assurance</span>
                                    <span className="font-medium">{displayData.assurance_mere_ou_employeur}</span>
                                </p>
                                {context === 'enAttente' && (
                                    <>
                                        <p className="flex items-center justify-between py-2 border-b">
                                            <span className="text-gray-600">Correspondant</span>
                                            <span className="font-medium">{displayData.correspondant}</span>
                                        </p>
                                        <p className="flex items-center justify-between py-2 border-b">
                                            <span className="text-gray-600">Date dépôt</span>
                                            <span className="font-medium">{displayData.date_depot}</span>
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetailsModal;
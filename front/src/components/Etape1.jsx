import axios from 'axios';
import React, { useState } from 'react'
import { CiSearch } from "react-icons/ci";
import { FaChild, FaBirthdayCake, FaUserAlt } from 'react-icons/fa';

const Etape1 = ({nextStep,setFormData,formData}) => {
    const [numSecurite,setNumSecurite] = useState("");
    const [enfantSelectionne , setEnfantSelectionne] = useState(null);
    const [enfants , setEnfants] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState("");

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

    const rechercheEnfants = async () =>{
        if (!numSecurite.trim()) {
            setError("Veuillez entrer un numéro de sécurité sociale");
            return;
        }
        setIsSearching(true);
        setError("");
        try{
            const response = await fetch(`http://localhost:5000/api/enfants/${numSecurite}`);
            const data = await response.json();
            if (data.error) {
                setError("Aucun enfant trouvé pour ce numéro de sécurité sociale");
                setEnfants([]);
            } else {
                setEnfants(data);
                if (data.length === 0) {
                    setError("Aucun enfant trouvé pour ce numéro de sécurité sociale");
                }
            }
        } catch(error){
            setError("Une erreur est survenue lors de la recherche");
            setEnfants([]);
        } finally {
            setIsSearching(false);
        }
    }

    const handleSelect = (child) =>{
       setEnfantSelectionne(child);
    };

    const handleNext = () =>{
        setFormData((prev)=>({
            ...prev,
            numSecurite:numSecurite,
            enfantSelectionne:enfantSelectionne,
        }));
        nextStep();
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            rechercheEnfants();
        }
    }

    return (
        <div className="space-y-8">
            {/* Barre de recherche */}
            <div className="max-w-2xl mx-auto">
                <div className="relative">
                    <input 
                        type="text"
                        name="search" 
                        placeholder="Numéro de sécurité sociale"
                        value={numSecurite}
                        onChange={(e) => setNumSecurite(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="w-full px-6 py-4 bg-[#DAEAF4] rounded-lg 
                            text-[#00428C] placeholder-[#00428C]/50
                            focus:outline-none focus:ring-2 focus:ring-[#006DB8] 
                            transition-all duration-300
                            pr-12"
                    />
                    <button 
                        onClick={rechercheEnfants}
                        disabled={isSearching}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2
                            w-10 h-10 flex items-center justify-center
                            text-[#00428C] hover:text-[#006DB8]
                            transition-all duration-300
                            disabled:opacity-50"
                    >
                        <CiSearch className="w-6 h-6" />
                    </button>
                </div>

                {/* Message d'erreur */}
                {error && (
                    <div className="mt-4 text-red-500 text-center animate-fade-in">
                        {error}
                    </div>
                )}
            </div>

            {/* Liste des enfants */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {enfants.map((child) => (
                    <div 
                        key={child.id}
                        onClick={() => handleSelect(child)}
                        className={`
                            relative overflow-hidden
                            rounded-xl p-6 cursor-pointer
                            transform transition-all duration-300
                            ${enfantSelectionne === child 
                                ? 'bg-[#00428C] text-white scale-105 shadow-lg' 
                                : 'bg-white text-[#00428C] hover:bg-[#DAEAF4]'
                            }
                            hover:shadow-xl hover:-translate-y-1
                            border-2 border-[#00428C]/10
                        `}
                    >
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <FaUserAlt className="w-5 h-5" />
                                <p className="font-medium">{child.nom} {child.prenom}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <FaBirthdayCake className="w-5 h-5" />
                                <p>{calculerAge(child.date_naissance)} ans</p>
                            </div>
                        </div>

                        {/* Indicateur de sélection */}
                        <div className={`
                            absolute top-2 right-2
                            w-3 h-3 rounded-full
                            transition-all duration-300
                            ${enfantSelectionne === child ? 'bg-white' : 'bg-[#00428C]/20'}
                        `} />
                    </div>
                ))}
            </div>

            {/* Bouton suivant */}
            {enfantSelectionne && (
                <div className="flex justify-end mt-8">
                    <button 
                        onClick={handleNext}
                        className="
                            bg-[#00428C] text-white
                            px-8 py-3 rounded-lg
                            font-medium
                            transform transition-all duration-300
                            hover:bg-[#006DB8] hover:scale-105 hover:shadow-lg
                            active:scale-95
                        "
                    >
                        Suivant
                    </button>
                </div>
            )}
        </div>
    )
}

export default Etape1
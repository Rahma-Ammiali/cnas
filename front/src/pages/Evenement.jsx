import React, { useState } from 'react'
import Side from '../components/Side'
import { FaCalendarPlus, FaChalkboardTeacher, FaUserGraduate, FaCalendarAlt } from 'react-icons/fa'

const Evenement = () => {
    const [newEvent, setNewEvent] = useState({title: '', date: ''})
    const [formData, setFormData] = useState({
        nom_classe: "",
        nbr_places: "",
        annee_scolaire: ""
    })

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        try {
            const response = await fetch("http://localhost:5000/api/classes", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData),
            })
            const data = await response.json();
            if(response.ok) {
                alert("Capacité enregistrée !")
                setFormData({
                    nom_classe: "",
                    nbr_places: "",
                    annee_scolaire: ""
                })
            } else {
                alert(data.error || "Erreur lors de l'enregistrement")
            }
        } catch (error) {
            console.error(error);
            alert("Erreur réseau")
        }
    }

    const handleAddEvent = async (e) => {
        e.preventDefault()
        if(!newEvent.title || !newEvent.date) {
            alert("Veuillez remplir tous les champs")
            return
        }
        try {
            const response = await fetch("http://localhost:5000/api/event", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newEvent)
            })
            const data = await response.json();
            console.log("Response backend:", data)
            if(response.ok) {
                alert("Événement enregistré")
                setNewEvent({title: '', date: ''});
            } else {
                alert("Erreur lors de l'enregistrement")
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi du formulaire:", error)
        }
    }

    return (
        <Side>
            <div className="min-h-screen bg-gradient-to-b from-white to-[#f0f7ff] p-6">
                <div className="max-w-6xl mx-auto space-y-8">
                    <h1 className="text-3xl font-bold text-center">
                        <span className="bg-gradient-to-r from-[#00428C] to-[#006DB8] text-transparent bg-clip-text">
                            Gestion des Événements et des Classes
                        </span>
                    </h1>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Formulaire des événements */}
                        <div className="bg-white rounded-2xl p-8 shadow-[0_10px_30px_rgba(8,_112,_184,_0.2)]">
                            <div className="flex items-center gap-3 mb-6">
                                <FaCalendarPlus className="w-6 h-6 text-[#00428C]" />
                                <h2 className="text-xl font-semibold text-[#00428C]">
                                    Nouvel Événement
                                </h2>
                            </div>

                            <form onSubmit={handleAddEvent} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm text-[#00428C]/70 font-medium block">
                                        Titre de l'événement
                                    </label>
                                    <div className="relative">
                                        <input 
                                            type="text"
                                            name="title"
                                            value={newEvent.title}
                                            onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                                            className="
                                                w-full px-6 py-4 bg-[#DAEAF4] rounded-lg
                                                text-[#00428C] placeholder-[#00428C]/50
                                                focus:outline-none focus:ring-2 focus:ring-[#006DB8]
                                                transition-all duration-300
                                                pl-12
                                            "
                                            placeholder="Nom de l'événement"
                                        />
                                        <FaCalendarAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00428C]/50" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-[#00428C]/70 font-medium block">
                                        Date
                                    </label>
                                    <input 
                                        type="date"
                                        name="date"
                                        value={newEvent.date}
                                        onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                                        className="
                                            w-full px-6 py-4 bg-[#DAEAF4] rounded-lg
                                            text-[#00428C] placeholder-[#00428C]/50
                                            focus:outline-none focus:ring-2 focus:ring-[#006DB8]
                                            transition-all duration-300
                                        "
                                    />
                                </div>

                                <button 
                                    type="submit"
                                    className="
                                        w-full px-6 py-4 rounded-lg
                                        bg-[#00428C] text-white
                                        hover:bg-[#006DB8]
                                        transition-all duration-300
                                        transform hover:scale-105
                                        font-medium
                                    "
                                >
                                    Enregistrer l'événement
                                </button>
                            </form>
                        </div>

                        {/* Formulaire des capacités */}
                        <div className="bg-white rounded-2xl p-8 shadow-[0_10px_30px_rgba(8,_112,_184,_0.2)]">
                            <div className="flex items-center gap-3 mb-6">
                                <FaChalkboardTeacher className="w-6 h-6 text-[#00428C]" />
                                <h2 className="text-xl font-semibold text-[#00428C]">
                                    Capacité des Classes
                                </h2>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm text-[#00428C]/70 font-medium block">
                                        Classe
                                    </label>
                                    <div className="relative">
                                        <select 
                                            name="nom_classe"
                                            value={formData.nom_classe}
                                            onChange={handleChange}
                                            className="
                                                w-full px-6 py-4 bg-[#DAEAF4] rounded-lg
                                                text-[#00428C] placeholder-[#00428C]/50
                                                focus:outline-none focus:ring-2 focus:ring-[#006DB8]
                                                transition-all duration-300
                                                pl-12
                                                appearance-none
                                            "
                                            required
                                        >
                                            <option value="">-- Choisir une classe --</option>
                                            <option value="petite section">Petite section</option>
                                            <option value="moyenne section">Moyenne section</option>
                                            <option value="grande section">Grande section</option>
                                        </select>
                                        <FaUserGraduate className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00428C]/50" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-[#00428C]/70 font-medium block">
                                        Nombre de places
                                    </label>
                                    <input 
                                        type="number"
                                        name="nbr_places"
                                        value={formData.nbr_places}
                                        onChange={handleChange}
                                        className="
                                            w-full px-6 py-4 bg-[#DAEAF4] rounded-lg
                                            text-[#00428C] placeholder-[#00428C]/50
                                            focus:outline-none focus:ring-2 focus:ring-[#006DB8]
                                            transition-all duration-300
                                        "
                                        required
                                        min="0"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-[#00428C]/70 font-medium block">
                                        Année scolaire
                                    </label>
                                    <input 
                                        type="text"
                                        name="annee_scolaire"
                                        value={formData.annee_scolaire}
                                        onChange={handleChange}
                                        placeholder="ex : 2024 - 2025"
                                        className="
                                            w-full px-6 py-4 bg-[#DAEAF4] rounded-lg
                                            text-[#00428C] placeholder-[#00428C]/50
                                            focus:outline-none focus:ring-2 focus:ring-[#006DB8]
                                            transition-all duration-300
                                        "
                                        required
                                    />
                                </div>

                                <button 
                                    type="submit"
                                    className="
                                        w-full px-6 py-4 rounded-lg
                                        bg-[#00428C] text-white
                                        hover:bg-[#006DB8]
                                        transition-all duration-300
                                        transform hover:scale-105
                                        font-medium
                                    "
                                >
                                    Enregistrer la capacité
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Side>
    )
}

export default Evenement
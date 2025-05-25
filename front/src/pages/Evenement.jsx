import React, { useState } from 'react'
import Side from '../components/Side'

const Evenement = () => {
    const [newEvent,setNewEvent] = useState({title:'',date:''})
    const [formData,setFormData] = useState({
        nom_classe : "",
        nbr_places:"",
        annee_scolaire:""
    })
    const handleChange = (e) =>{
        const {name,value} = e.target;
        setFormData((prev) =>({
            ...prev,
            [name]:value,
        }))
        }
    const handleSubmit = async(e) =>{
        e.preventDefault()
        try{
            const response = await fetch("http://localhost:5000/api/classes",{
                method:'POST',
                headers:{
                    "Content-Type" : "application/json"
                },
                body:JSON.stringify(formData),
            })
            const data = await response.json();
            if(response.ok){
                alert("capacité enregistrée !")
                setFormData({
                    nom_classe : "",
                    nbr_places:"",
                    annee_scolaire:""
                })
            }else{
                alert(data.error || "erreur lors de l'enregistrement ")
            }
        }catch (error){
            console.error(error);
            alert("erreur reseau ")
        }
    }
    const handleAddEvent = async (e) =>{
        e.preventDefault()
        if(!newEvent.title || !newEvent.date ) {
            alert("veuillez remplir tous les champs ")
            return
        }
        try{
            const response = await fetch("http://localhost:5000/api/events",{
                method:'POST',
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(newEvent)
            })
            const data = await response.json();
            console.log("response backend ",data)
            if(response.ok){
                alert("evenement enregisté")
                setNewEvent({title:'',date:''});
            }else{
                alert("erreur lors de l'enregistrement ")
            }
            

        }catch (error){
            console.error("erreur lors de l'envoi du formulaire ",error)
        }
        
    }
  return (
    <Side>
        <div className="overflow-hidden h-[100vh]">
            <h1 className='text-3xl font-bold text-[#00428C] mb-6'>Formulaire des evenements et des capacitées</h1>
            <div className='flex flex-col lg:flex-row justify-center items-start gap-8 w-full'>
                {/* Events Form */}
                <form 
                    onSubmit={handleAddEvent}
                    className=' border border-gray-200 w-full lg:w-1/2 xl:w-2/5 bg-white shadow-xl rounded-xl p-8 flex flex-col gap-6'
                >
                    <h2 className='text-2xl font-bold text-[#00428C] text-center mb-4'>Evènement</h2>
                    <div className='w-full'>
                        <label htmlFor="Evenement" className='block text-lg font-semibold text-[#00428C] mb-2'>Titre :</label>
                        <input 
                            type="text" 
                            name="title"
                            value={newEvent.title}
                            onChange={(e) => setNewEvent({...newEvent , title:e.target.value})}
                            className='w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200' 
                        />
                    </div>
                    <div className='w-full'>
                        <label htmlFor="Date" className='block text-lg font-semibold text-[#00428C] mb-2'>Date :</label>
                        <input 
                            type="date" 
                            name="date" 
                            value={newEvent.date}
                            onChange={(e) => setNewEvent({...newEvent,date:e.target.value})} 
                            className='w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200' 
                        />
                    </div>
                    <button 
                        type='submit'
                        className='w-full max-w-xs mx-auto bg-[#00428C] hover:bg-[#006DB8] text-white font-medium py-3 px-6 rounded-lg transition duration-200 mt-4'
                    >
                        Enregistrer
                    </button>
                </form>

                {/* Capacity Form */}
                <form 
                    onSubmit={handleSubmit}
                    className='border h-[70vh] border-gray-200 w-full lg:w-1/2 xl:w-2/5 bg-white shadow-xl rounded-xl p-6 flex flex-col gap-4'
                >
                    
                    <h2 className='text-2xl font-bold text-[#00428C] text-center '>Capacité des classes</h2>
                    <div className='w-full'>
                        <label htmlFor="classe-1" className='block text-lg font-semibold text-[#00428C] '>Classe :</label>
                        <select 
                            name="nom_classe"
                            value={formData.nom_classe}
                            onChange={handleChange}
                            className='w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200'
                            required
                        >
                            <option value=""> -- choisir une classe --</option>
                            <option value="petite section">petite section</option>
                            <option value="moyenne section">moyenne section</option>
                            <option value="grande section">grande section</option>
                        </select>
                    </div>
                    <div className='w-full'>
                        <label htmlFor="nbr1" className='block text-lg font-semibold text-[#00428C] '>Nombre de places :</label>
                        <input 
                            type="number" 
                            name='nbr_places'
                            value={formData.nbr_places}
                            onChange={handleChange}
                            className='w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200'
                            required
                        />
                    </div>
                    <div className='w-full'>
                        <label htmlFor="annee" className='block text-lg font-semibold text-[#00428C] '>Année scolaire :</label>
                        <input 
                            type="text" 
                            name='annee_scolaire'
                            value={formData.annee_scolaire}
                            onChange={handleChange}
                            placeholder='ex : 2024 - 2025'
                            className='w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200'
                            required
                        />
                    </div>
                    <button 
                        type='submit'
                        className='w-full max-w-xs mx-auto bg-[#00428C] hover:bg-[#006DB8] text-white font-medium py-3 px-6 rounded-lg transition duration-200 mt-2'
                    >
                        Enregistrer
                    </button>
                </form>
            </div>
        </div>
    </Side>
  )
}

export default Evenement
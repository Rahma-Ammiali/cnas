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
        <h1 className='text-[#00428C] font-bold text-[30px]'>formulaire des evenements et des capacitées :</h1>
        <div className='flex justify-center items-center gap-7'>
        <form 
        onSubmit={handleAddEvent}
        className='h-[60vh] shadow-2xl rounded-xl w-[30vw] mt-12 p-6 flex flex-col gap-5 flex justify-center items-center'
        >
            <label htmlFor="Evenement"
            className='text-[#00428C] font-bold text-2xl'>Evènement :</label>
            <input 
            type="text" 
            name="title"
            value={newEvent.title}
            onChange={(e) => setNewEvent({...newEvent , title:e.target.value})}
            className='bg-[#DAEAF4] w-[70%] p-4 rounded-md focus:outline-none focus:border-[#006DB8]' 
             />
             <label htmlFor="Date"
             className='text-[#00428C] font-bold text-2xl'>Date :</label>
             <input type="date" name="date" 
             value={newEvent.date}
             onChange={(e) => setNewEvent({...newEvent,date:e.target.value})} 
             className=' relative bg-[#DAEAF4] w-[70%] p-4 rounded-md focus:outline-none focus:border-[#006DB8]' 
             />
             <div className='w-[100%] flex justify-center'>
             <button 
             type='submit'
             className='w-[50%] bg-[#00428C] text-[white] py-2 px-4 rounded-lg cursor-pointer mt-5'
             >Enregistrer</button>
             </div>
        </form>
        <form onSubmit={handleSubmit}
        className='h-[70vh] shadow-2xl rounded-xl w-[30vw] mt-12 p-6 flex flex-col gap-5 flex justify-center items-center'>
            <label htmlFor="classe-1"
                className='text-[#00428C] font-bold text-2xl'
                >Classe1</label>
            <select name="nom_classe"
            value={formData.nom_classe}
            onChange={handleChange}
            className='bg-[#DAEAF4] w-[70%] p-4 rounded-md focus:outline-none focus:border-[#006DB8]' 
            required>
                <option value=""> -- choisir une classe --</option>
                <option value="petite section">petite section</option>
                <option value="moyenne section">moyenne section</option>
                <option value="grande section">grande section</option>
            </select>
            <label htmlFor="nbr1"
                className='text-[#00428C] font-bold text-2xl'
            >nombre de places : </label>
            <input type="number" 
            name='nbr_places'
            value={formData.nbr_places}
            onChange={handleChange}
            className='bg-[#DAEAF4] w-[70%] p-4 rounded-md focus:outline-none focus:border-[#006DB8]' 
            required
            />
            <label htmlFor="annee"
                className='text-[#00428C] font-bold text-2xl'
            >annee scolaire : </label>
            <input type="text" 
            name='annee_scolaire'
            value={formData.annee_scolaire}
            onChange={handleChange}
            placeholder='ex : 2024 - 2025'
            className='bg-[#DAEAF4] w-[70%] p-4 rounded-md focus:outline-none focus:border-[#006DB8]' 
            required
            />
            <button type='submit'
                className='w-[50%] bg-[#00428C] text-[white] py-2 px-4 rounded-lg cursor-pointer mt-5'
            >Enregistrer</button>
        </form>
        </div>
    </Side>
  )
}

export default Evenement
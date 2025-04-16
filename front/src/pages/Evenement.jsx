import React, { useState } from 'react'
import Side from '../components/Side'


const Evenement = () => {
    const [events,setEvents] = useState([])
    const [newEvent,setNewEvent] = useState({title:'',date:''})
    const randomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16);
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
        <h1 className='text-[#00428C] font-bold text-[30px]'>formulaire des evenements :</h1>
        <div className='flex justify-center items-center'>
        <form 
        onSubmit={handleAddEvent}
        className='h-[60vh] shadow-2xl rounded-xl w-[40vw] mt-12 p-6 flex flex-col gap-5 flex justify-center items-center'
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
        </div>
    </Side>
  )
}

export default Evenement
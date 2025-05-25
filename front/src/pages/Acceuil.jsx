import React, { useEffect, useState } from 'react'
import Side from '../components/Side'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

const Acceuil = () => {
  const [events,setEvents] =useState([])
  useEffect(()=>{
    const fetchEvents = async () =>{
      try{
        const response = await fetch('http://localhost:5000/api/event')
        const data = await response.json()
        console.log("Événements récupérés:", data) // Pour déboguer
        setEvents(data)
      }catch(error){
        console.error("erreur de recuperation des évenements : ",error)
      }
    }
    fetchEvents()
  },[])
  return (
    <Side>
      <div className='w-[60%] h-[50%]'>
            <FullCalendar 
            plugins={[dayGridPlugin,interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            />
        </div>
    </Side>
  )
}

export default Acceuil
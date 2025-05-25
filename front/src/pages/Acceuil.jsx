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
        console.log("Événements récupérés:", data)
        setEvents(data)
      }catch(error){
        console.error("erreur de recuperation des évenements : ",error)
      }
    }
    fetchEvents()
  },[])
  
  return (
    <Side>
      <div className="min-h-screen  p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-[#00428C] mb-8 text-center">
            <span className="bg-gradient-to-r from-[#00428C] to-[#006DB8] text-transparent bg-clip-text">
              Calendrier des Événements
            </span>
          </h1>
          
          <div className="bg-white rounded-2xl shadow-[0_6px_15px_rgba(2,_112,_184,_0.3)] p-6 transform hover:scale-[1.01] transition-all duration-300">
            <FullCalendar 
              plugins={[dayGridPlugin,interactionPlugin]}
              initialView="dayGridMonth"
              events={events}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,dayGridWeek'
              }}
              buttonText={{
                today: "Aujourd'hui",
                month: 'Mois',
                week: 'Semaine'
              }}
              locale='fr'
              height="700px"
              contentHeight="auto"
              dayMaxEvents={3}
              eventDisplay="block"
              eventClassNames="hover:scale-105 transition-transform duration-200"
              dayCellClassNames="hover:bg-blue-50 transition-colors duration-200"
              titleFormat={{ year: 'numeric', month: 'long' }}
              dayHeaderFormat={{ weekday: 'long' }}
            />
          </div>
        </div>
      </div>
    </Side>
  )
}

export default Acceuil
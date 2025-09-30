import React, { useEffect, useState } from 'react'
import { FaChild, FaUserTie, FaUserAlt, FaBriefcase, FaSpinner } from 'react-icons/fa'
import { IoArrowBack, IoArrowForward } from 'react-icons/io5'

const Etape2 = ({nextStep, prevStep, formData}) => {
  const [parents,setParents] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchParents = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/parents/${formData.enfantSelectionne.id}`)
        if(!response.ok) {
          throw new Error('Erreur lors de la récupération des parents')
        }
        const data = await response.json()
        setParents(data)
      } catch (error) {
        setError("Impossible de charger les informations des parents")
        console.error("Erreur:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchParents()
  }, [formData.enfantSelectionne.id])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-8">
      <h2 className='text-3xl font-bold text-center mb-8'>
        <span className="bg-gradient-to-r from-[#00428C] to-[#006DB8] text-transparent bg-clip-text">
          Informations de la Famille
        </span>
      </h2>
      
      <div className='grid md:grid-cols-2 gap-8'>
        {/* Information de l'enfant */}
        <div className='bg-white rounded-2xl shadow-[0_10px_30px_rgba(8,_112,_184,_0.3)] p-8 transform hover:scale-[1.01] transition-all duration-300'>
          <div className='flex items-center gap-3 mb-6'>
            <FaChild className='text-2xl text-[#00428C]' />
            <h3 className='text-2xl font-bold text-[#00428C]'>Enfant</h3>
          </div>

          <div className='space-y-6'>
            <div className='group'>
              <label className='text-sm text-[#00428C]/70 font-medium'>Nom</label>
              <div className='flex items-center gap-3 mt-1 p-3 bg-[#DAEAF4] rounded-lg'>
                <FaUserAlt className='text-[#00428C]' />
                <span className='text-[#00428C] font-medium'>{formData.enfantSelectionne?.nom}</span>
              </div>
            </div>

            <div className='group'>
              <label className='text-sm text-[#00428C]/70 font-medium'>Prénom</label>
              <div className='flex items-center gap-3 mt-1 p-3 bg-[#DAEAF4] rounded-lg'>
                <FaUserAlt className='text-[#00428C]' />
                <span className='text-[#00428C] font-medium'>{formData.enfantSelectionne?.prenom}</span>
              </div>
            </div>

            <div className='group'>
              <label className='text-sm text-[#00428C]/70 font-medium'>Date de naissance</label>
              <div className='flex items-center gap-3 mt-1 p-3 bg-[#DAEAF4] rounded-lg'>
                <FaUserAlt className='text-[#00428C]' />
                <span className='text-[#00428C] font-medium'>
                  {formatDate(formData.enfantSelectionne?.date_naissance)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Information des parents */}
        <div className='bg-white rounded-2xl shadow-[0_10px_30px_rgba(8,_112,_184,_0.3)] p-8 transform hover:scale-[1.01] transition-all duration-300'>
          <div className='flex items-center gap-3 mb-6'>
            <FaUserTie className='text-2xl text-[#00428C]' />
            <h3 className='text-2xl font-bold text-[#00428C]'>Parents</h3>
          </div>

          {loading ? (
            <div className='flex items-center justify-center h-[300px]'>
              <FaSpinner className='w-8 h-8 text-[#00428C] animate-spin' />
            </div>
          ) : error ? (
            <div className='flex items-center justify-center h-[300px] text-red-500'>
              {error}
            </div>
          ) : (
            <div className='space-y-6'>
              {/* Père */}
              <div className='space-y-4'>
                <h4 className='text-lg font-semibold text-[#00428C]'>Père</h4>
                <div className='group'>
                  <label className='text-sm text-[#00428C]/70 font-medium'>Nom et Prénom</label>
                  <div className='flex items-center gap-3 mt-1 p-3 bg-[#DAEAF4] rounded-lg'>
                    <FaUserTie className='text-[#00428C]' />
                    <span className='text-[#00428C] font-medium'>
                      {parents.nom_pere} {parents.prenom_pere}
                    </span>
                  </div>
                </div>
                <div className='group'>
                  <label className='text-sm text-[#00428C]/70 font-medium'>Secteur d'activité</label>
                  <div className='flex items-center gap-3 mt-1 p-3 bg-[#DAEAF4] rounded-lg'>
                    <FaBriefcase className='text-[#00428C]' />
                    <span className='text-[#00428C] font-medium'>{parents.secteur_activite_pere}</span>
                  </div>
                </div>
              </div>

              {/* Mère */}
              <div className='space-y-4'>
                <h4 className='text-lg font-semibold text-[#00428C]'>Mère</h4>
                <div className='group'>
                  <label className='text-sm text-[#00428C]/70 font-medium'>Nom et Prénom</label>
                  <div className='flex items-center gap-3 mt-1 p-3 bg-[#DAEAF4] rounded-lg'>
                    <FaUserTie className='text-[#00428C]' />
                    <span className='text-[#00428C] font-medium'>
                      {parents.nom_mere} {parents.prenom_mere}
                    </span>
                  </div>
                </div>
                <div className='group'>
                  <label className='text-sm text-[#00428C]/70 font-medium'>Secteur d'activité</label>
                  <div className='flex items-center gap-3 mt-1 p-3 bg-[#DAEAF4] rounded-lg'>
                    <FaBriefcase className='text-[#00428C]' />
                    <span className='text-[#00428C] font-medium'>{parents.secteur_activite_mere}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Boutons de navigation */}
      <div className='flex justify-between mt-12'>
        <button
          onClick={prevStep}
          className='
            flex items-center gap-2
            bg-white text-[#00428C]
            px-6 py-3 rounded-lg
            font-medium border-2 border-[#00428C]
            transform transition-all duration-300
            hover:bg-[#00428C] hover:text-white
            hover:scale-105 hover:shadow-lg
            active:scale-95
          '
        >
          <IoArrowBack />
          Précédent
        </button>
        <button 
          onClick={nextStep}
          className='
            flex items-center gap-2
            bg-[#00428C] text-white
            px-6 py-3 rounded-lg
            font-medium
            transform transition-all duration-300
            hover:bg-[#006DB8]
            hover:scale-105 hover:shadow-lg
            active:scale-95
          '
        >
          Suivant
          <IoArrowForward />
        </button>
      </div>
    </div>
  )
}

export default Etape2
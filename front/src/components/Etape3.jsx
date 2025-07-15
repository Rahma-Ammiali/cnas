import React, { useState } from 'react'
import { IoArrowBack, IoSave } from 'react-icons/io5'
import { FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaUserShield, FaMoneyBillWave, FaWheelchair, FaHeartbeat, FaUserFriends } from 'react-icons/fa'

const Etape3 = ({prevStep, formData, setFormData}) => {
  const [handicap, setHandicap] = useState("non")
  const [maladieChronique, setMaladieChronique] = useState("non")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleChange = (e) => {
    const {name, value} = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const response = await fetch("http://localhost:5000/api/preinscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          handicap_details: formData.handicap_details || "",
          maladie_details: formData.maladie_details || ""
        })
      })
      const data = await response.json()
      if(response.ok) {
        setSubmitSuccess(true)
        setTimeout(() => {
          setFormData({
            assurance_mere_ou_employeur: "",
            tarif_preferentiel: "",
            tel_pere: "",
            tel_mere: "",
            adresse: "",
            annee_scolaire: "",
            handicap: "",
            handicap_details: "",
            maladieChronique: "",
            maladie_details: "",
            correspondant: "",
            date_depot: ""
          })
          setHandicap("non")
          setMaladieChronique("non")
          setSubmitSuccess(false)
        }, 2000)
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <h2 className='text-3xl font-bold text-center mb-8'>
        <span className="bg-gradient-to-r from-[#00428C] to-[#006DB8] text-transparent bg-clip-text">
          Informations Complémentaires
        </span>
      </h2>

      <form onSubmit={handleSubmit} className='space-y-8'>
        <div className='grid md:grid-cols-2 gap-8'>
          {/* Colonne gauche */}
          <div className='space-y-6'>
            <div className='group'>
              <label className='flex items-center gap-2 text-[#00428C] font-medium mb-2'>
                <FaUserShield className="w-5 h-5" />
                Assurance de la mère ou employeur
              </label>
              <input 
                type="text" 
                name='assurance_mere_ou_employeur' 
                value={formData.assurance_mere_ou_employeur}
                onChange={handleChange}
                required
                className='w-full p-3 bg-[#DAEAF4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006DB8] transition-all duration-300 hover:shadow-md'
              />
            </div>

            <div className='group'>
              <label className='flex items-center gap-2 text-[#00428C] font-medium mb-2'>
                <FaMoneyBillWave className="w-5 h-5" />
                Tarif Préférentiel
              </label>
              <input 
                type="text" 
                name="tarif_preferentiel" 
                value={formData.tarif_preferentiel}
                onChange={handleChange}
                required
                className='w-full p-3 bg-[#DAEAF4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006DB8] transition-all duration-300 hover:shadow-md'
              />
            </div>

            <div className='group'>
              <label className='flex items-center gap-2 text-[#00428C] font-medium mb-2'>
                <FaPhone className="w-5 h-5" />
                Numéro de téléphone du père
              </label>
              <input 
                type="tel" 
                name="tel_pere" 
                value={formData.tel_pere}
                onChange={handleChange}
                required
                className='w-full p-3 bg-[#DAEAF4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006DB8] transition-all duration-300 hover:shadow-md'
              />
            </div>

            <div className='group'>
              <label className='flex items-center gap-2 text-[#00428C] font-medium mb-2'>
                <FaPhone className="w-5 h-5" />
                Numéro de téléphone de la mère
              </label>
              <input 
                type="tel" 
                name="tel_mere" 
                value={formData.tel_mere}
                onChange={handleChange}
                required
                className='w-full p-3 bg-[#DAEAF4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006DB8] transition-all duration-300 hover:shadow-md'
              />
            </div>

            <div className='group'>
              <label className='flex items-center gap-2 text-[#00428C] font-medium mb-2'>
                <FaMapMarkerAlt className="w-5 h-5" />
                Adresse
              </label>
              <input 
                type="text" 
                name="adresse" 
                value={formData.adresse}
                onChange={handleChange}
                required
                className='w-full p-3 bg-[#DAEAF4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006DB8] transition-all duration-300 hover:shadow-md'
              />
            </div>
          </div>

          {/* Colonne droite */}
          <div className='space-y-6'>
            <div className='group'>
              <label className='flex items-center gap-2 text-[#00428C] font-medium mb-2'>
                <FaCalendarAlt className="w-5 h-5" />
                Année Scolaire
              </label>
              <input 
                type="text" 
                name="annee_scolaire" 
                value={formData.annee_scolaire}
                onChange={handleChange}
                required
                placeholder="ex: 2024-2025"
                className='w-full p-3 bg-[#DAEAF4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006DB8] transition-all duration-300 hover:shadow-md'
              />
            </div>

            <div className='group'>
              <label className='flex items-center gap-2 text-[#00428C] font-medium mb-2'>
                <FaWheelchair className="w-5 h-5" />
                Situation de Handicap
              </label>
              <div className='flex gap-4'>
                <select 
                  name="handicap" 
                  value={formData.handicap || "non"} 
                  onChange={(e) => {
                    setHandicap(e.target.value)
                    handleChange(e)
                  }}
                  className='w-24 p-3 bg-[#DAEAF4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006DB8] transition-all duration-300 hover:shadow-md'
                >
                  <option value=" ">---</option>
                  <option value="non">Non</option>
                  <option value="oui">Oui</option>
                </select>
                {handicap === "oui" && (
                  <input 
                    type="text" 
                    name="handicap_details" 
                    placeholder='Détails du handicap' 
                    onChange={handleChange}
                    required
                    className='flex-1 p-3 bg-[#DAEAF4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006DB8] transition-all duration-300 hover:shadow-md'
                  />
                )}
              </div>
            </div>

            <div className='group'>
              <label className='flex items-center gap-2 text-[#00428C] font-medium mb-2'>
                <FaHeartbeat className="w-5 h-5" />
                Maladie Chronique
              </label>
              <div className='flex gap-4'>
                <select 
                  name="maladie_chronique" 
                  value={formData.maladieChronique || "non"} 
                  onChange={(e) => {
                    setMaladieChronique(e.target.value)
                    handleChange(e)
                  }}
                  className='w-24 p-3 bg-[#DAEAF4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006DB8] transition-all duration-300 hover:shadow-md'
                >
                  <option value=" ">---</option>
                  <option value="non">Non</option>
                  <option value="oui">Oui</option>
                </select>
                {maladieChronique === "oui" && (
                  <input 
                    type="text" 
                    name="maladie_details" 
                    placeholder='Détails de la maladie' 
                    onChange={handleChange}
                    required
                    className='flex-1 p-3 bg-[#DAEAF4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006DB8] transition-all duration-300 hover:shadow-md'
                  />
                )}
              </div>
            </div>

            <div className='group'>
              <label className='flex items-center gap-2 text-[#00428C] font-medium mb-2'>
                <FaUserFriends className="w-5 h-5" />
                Correspondant
              </label>
              <input 
                type="text" 
                name="correspondant" 
                value={formData.correspondant}
                onChange={handleChange}
                className='w-full p-3 bg-[#DAEAF4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006DB8] transition-all duration-300 hover:shadow-md'
              />
            </div>

            <div className='group'>
              <label className='flex items-center gap-2 text-[#00428C] font-medium mb-2'>
                <FaCalendarAlt className="w-5 h-5" />
                Date de dépôt de la demande
              </label>
              <input 
                type="date" 
                name="date_depot"
                value={formData.date_depot} 
                onChange={handleChange}
                required
                className='w-full p-3 bg-[#DAEAF4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006DB8] transition-all duration-300 hover:shadow-md'
              />
            </div>
          </div>
        </div>

        {/* Boutons de navigation */}
        <div className='flex justify-between mt-12'>
          <button
            type="button"
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
            type="submit"
            disabled={isSubmitting}
            className={`
              flex items-center gap-2
              px-6 py-3 rounded-lg
              font-medium
              transform transition-all duration-300
              hover:scale-105 hover:shadow-lg
              active:scale-95
              ${submitSuccess 
                ? 'bg-green-500 text-white'
                : 'bg-[#00428C] text-white hover:bg-[#006DB8]'
              }
              ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}
            `}
          >
            <IoSave className={`w-5 h-5 ${isSubmitting ? 'animate-spin' : ''}`} />
            {submitSuccess ? 'Enregistré !' : isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Etape3
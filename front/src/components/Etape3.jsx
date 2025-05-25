import React, {useState } from 'react'

const Etape3 = ({prevStep,formData,setFormData}) => {
  const[handicap,setHandicap] =useState("non")
  const[maladieChronique,setMaladieChronique] = useState("non")
  const handleChange = (e) =>{
    const {name,value} = e.target ; 
    setFormData((prev) =>({
      ...prev,
      [name]:value,
    }))
  }
  const handleSubmit = async (e) =>{
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/preinscription" , {
        method:"POST",
        headers:{
          "Content-Type" : "application/json"
        },
        body:JSON.stringify({
          ...formData,
          handicap_details:formData.handicap_details || "",
          maladie_details:formData.maladie_details || ""
        })
      });
      const data = await response.json();
      console.log("reponse backend : ",data)
      if(response.ok){
        alert("preinscription enregistrée !")
      }
      setFormData ({
      assurance_mere_ou_employeur : "",
      tarif_preferentiel : "",
      tel_pere : "",
      tel_mere: "",
      adresse : "",
      annee_scolaire : "",
      handicap  : "",
      handicap_details : "",
      maladieChronique: "",
      maladie_details: "",
      correspondant : "",
      date_depot : ""
    })
    setHandicap("non");
    setMaladieChronique("non");
    }catch (error){
      console.error("erreur lors de l'envoi du formulaire : ",error)
    }
    
  }
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit} className='space-y-6 bg-white p-8 rounded-lg shadow-md border border-gray-200'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Left Column */}
          <div className='space-y-4'>
            <div className='flex flex-col'>
              <label htmlFor="assurance_mere_ou_employeur" className='text-gray-700 font-medium mb-1'>Assurance de la mere ou employeur :</label>
              <input 
                type="text" 
                name='assurance_mere_ou_employeur' 
                value={formData.assurance_mere_ou_employeur}
                onChange={handleChange}
                required
                className='py-2 px-4 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full'/>
            </div>

            <div className='flex flex-col'>
              <label className='text-gray-700 font-medium mb-1'>Tarif Préférentiel</label>
              <input 
                type="text" 
                name="tarif_preferentiel" 
                value={formData.tarif_preferentiel}
                onChange={handleChange}
                required
                className='py-2 px-4 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full'/>
            </div>

            <div className='flex flex-col'>
              <label className='text-gray-700 font-medium mb-1'>Num Téléphone Pere</label>
              <input 
                type="text" 
                name="tel_pere" 
                value={formData.tel_pere}
                onChange={handleChange}
                required
                className='py-2 px-4 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full'/>
            </div>

            <div className='flex flex-col'>
              <label className='text-gray-700 font-medium mb-1'>Num Téléphone Mere</label>
              <input 
                type="text" 
                name="tel_mere" 
                value={formData.tel_mere}
                onChange={handleChange}
                required
                className='py-2 px-4 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full'/>
            </div>

            <div className='flex flex-col'>
              <label className='text-gray-700 font-medium mb-1'>Adresse</label>
              <input 
                type="text" 
                name="adresse" 
                value={formData.adresse}
                onChange={handleChange}
                required
                className='py-2 px-4 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full'/>
            </div>
          </div>

          {/* Right Column */}
          <div className='space-y-4'>
            <div className='flex flex-col'>
              <label className='text-gray-700 font-medium mb-1'>Année Scolaire</label>
              <input 
                type="text" 
                name="annee_scolaire" 
                value={formData.annee_scolaire}
                onChange={handleChange}
                required
                className='py-2 px-4 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full'/>
            </div>

            <div className='flex flex-col'>
              <label className='text-gray-700 font-medium mb-1'>Situation Handicap</label>
              <div className='flex items-center gap-4'>
                <select 
                  name="handicap" 
                  value={formData.handicap || "non"} 
                  onChange={(e)=>{
                    setHandicap(e.target.value);
                    handleChange(e);
                  }}
                  className='py-2 px-4 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-24'>
                  <option value=" ">---</option>
                  <option value="non">Non</option>
                  <option value="oui">Oui</option>
                </select>
                {handicap === "oui" && (
                  <input 
                    type="text" 
                    name="handicap_details" 
                    placeholder='Détails handicap' 
                    onChange={handleChange}
                    required
                    className='py-2 px-4 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex-1'/>
                )}
              </div>
            </div>

            <div className='flex flex-col'>
              <label className='text-gray-700 font-medium mb-1'>Maladie Chronique</label>
              <div className='flex items-center gap-4'>
                <select 
                  name="maladie_chronique" 
                  value={formData.maladieChronique || "non"} 
                  onChange={(e)=>{
                    setMaladieChronique(e.target.value);
                    handleChange(e);
                  }}
                  className='py-2 px-4 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-24'>
                  <option value=" ">---</option>
                  <option value="non">Non</option>
                  <option value="oui">Oui</option>
                </select>
                {maladieChronique === "oui" && (
                  <input 
                    type="text" 
                    name="maladie_details" 
                    placeholder='Détails Maladie chronique' 
                    onChange={handleChange}
                    required
                    className='py-2 px-4 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex-1'/>
                )}
              </div>
            </div>

            <div className='flex flex-col'>
              <label className='text-gray-700 font-medium mb-1'>Correspondant</label>
              <input 
                type="text" 
                name="correspondant" 
                value={formData.correspondant}
                onChange={handleChange}
                className='py-2 px-4 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full'/>
            </div>

            <div className='flex flex-col'> 
              <label className='text-gray-700 font-medium mb-1'>Date De Dépot De La Demande</label>
              <input 
                type="date" 
                name="date_depot"
                value={formData.date_depot} 
                onChange={handleChange}
                required
                className='py-2 px-4 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full'/>
            </div> 
          </div>
        </div>

        <div className='flex justify-between pt-6'>
          <button
            onClick={prevStep}
            className='bg-[#00428C] hover:bg-[#006DB8] text-white font-medium py-2 px-6 rounded-lg transition duration-200'
          >
            Précédent
          </button>
          <button 
            type='submit' 
            className='bg-[#00428C] hover:bg-[#006DB8] text-white font-medium py-2 px-6 rounded-lg transition duration-200'
          >
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  )
}

export default Etape3
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
    <div>
      <form onSubmit={handleSubmit} className='flex flex-col gap-3 p-5' >
        <div className='flex justify-between align-center' >
        <label htmlFor="assurance_mere_ou_employeur">Assurance de la mere ou employeur : </label>
        <input 
        type="text" 
        name='assurance_mere_ou_employeur' 
        value={formData.assurance_mere_ou_employeur}
        onChange={handleChange}
        required
        className='py-1 px-2 bg-[white] border-2 border-[#006DB8] rounded-md inline-block w-[50%]'/>
        </div>
        <div className='flex justify-between align-center'>
        <label>Tarif Préférentiel</label>
        <input 
        type="text" 
        name="tarif_preferentiel" 
        value={formData.tarif_preferentiel}
        onChange={handleChange}
        required
        className='py-1 px-2 bg-[white] border-2 border-[#006DB8] rounded-md inline-block w-[50%]'  />
        </div>
        <div className='flex justify-between align-center'>
        <label>Num Téléphone Pere </label>
        <input 
        type="text" 
        name="tel_pere" 
        value={formData.tel_pere}
        onChange={handleChange}
        required
        className='py-1 px-2 bg-[white] border-2 border-[#006DB8] rounded-md inline-block w-[50%]'  />
        </div>
        <div className='flex justify-between align-center'>
        <label>Num Téléphone Mere</label>
        <input 
        type="text" 
        name="tel_mere" 
        value={formData.tel_mere}
        onChange={handleChange}
        required
        className='py-1 px-2 bg-[white] border-2 border-[#006DB8] rounded-md inline-block w-[50%]'  />
        </div>
        <div className='flex justify-between align-center'>
        <label>Adresse </label>
        <input 
        type="text" 
        name="adresse" 
        value={formData.adresse}
        onChange={handleChange}
        required
        className='py-1 px-2 bg-[white] border-2 border-[#006DB8] rounded-md inline-block w-[50%]' />
        </div>
        <div className='flex justify-between align-center'>
        <label>Année Scolaire </label>
        <input 
        type="text" 
        name="annee_scolaire" 
        value={formData.annee_scolaire}
        onChange={handleChange}
        required
        className='py-1 px-2 bg-[white] border-2 border-[#006DB8] rounded-md inline-block w-[50%]' />
        </div>
        <div className='flex justify-between align-center'>
        <label >Situation Handicap</label>
        <select 
        name="handicap" value={formData.handicap || "non"} 
        onChange={(e)=>{
          setHandicap(e.target.value);
          handleChange(e);
        }}
        className='py-1 px-2 bg-[white] border-2 border-[#006DB8] rounded-md inline-block w-[10%] '>
          <option value=" ">---</option>
          <option value="non">Non</option>
          <option value="oui">Oui</option>
        </select>
        {handicap === "oui" && (
          <input type="text" name="handicap_details" 
          placeholder='détails handicap' 
          onChange={handleChange}
          required
          className='py-1 px-2 bg-[white] border-2 border-[#006DB8] rounded-md inline-block w-[50%]' />
        )}
        </div>
        <div className='flex justify-between align-center'>
        <label>Maladie Chronique </label>
        <select name="maladie_chronique" value={formData.maladieChronique || "non"} 
        onChange={(e)=>{
          setMaladieChronique(e.target.value);
          handleChange(e);
        }}
        className='py-1 px-2 bg-[white] border-2 border-[#006DB8] rounded-md inline-block w-[10%] '>
          <option value=" ">---</option>
          <option value="non">Non</option>
          <option value="oui">Oui</option>
        </select>
        {maladieChronique === "oui" && (
          <input type="text" name="maladie_details" 
          placeholder='détails Maladie chronique' 
          onChange={handleChange}
          required
          className='py-1 px-2 bg-[white] border-2 border-[#006DB8] rounded-md inline-block w-[50%]' />
        )}
        </div>
        <div className='flex justify-between align-center'>
        <label>Correspondant</label>
        <input type="text" name="correspondant" 
        value={formData.correspondant}
        onChange={handleChange}
        className='py-1 px-2 bg-[white] border-2 border-[#006DB8] rounded-md inline-block w-[50%]' />
        </div>
        <div className='flex justify-between align-center'> 
        <label>Date De Dépot De La Demande </label>
        <input type="date" name="date_depot"
        value={formData.date_depot} onChange={handleChange}
        required
        className='py-1 px-2 bg-[white] border-2 border-[#006DB8] rounded-md inline-block w-[50%]' />
        </div> 
        <button
        onClick={prevStep}
         className='absolute left-15 bottom-6 bg-[#00428C] text-[white] py-3 px-5 rounded-md cursor-pointer'
         >
          Previous
        </button>
        <button 
        type='submit' className='absolute right-15 bottom-6 bg-[#00428C] text-[white] py-3 px-5 rounded-md cursor-pointer'
         >Enregistrer
         </button>
      </form>
     
    </div>
  )
}

export default Etape3
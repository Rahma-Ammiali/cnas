import React, { useState } from 'react'
import axios from "axios";
import { CiSearch } from "react-icons/ci";
import Side from '../components/Side'
import Steps from '../components/Steps'
import Etape1 from '../components/Etape1'
import Etape2 from '../components/Etape2'
import Etape3 from '../components/Etape3'


const Preinscription = () => {
  const [step , setStep ] = useState(1)
  const [formData, setFormData] = useState({
    numSecurite : "", 
    enfantSelectionne : null, 
    infosSupplementaires : {}
  })
  const nextStep = () =>{
    if(step<3) setStep(step+1);
  }
  const prevStep = ()=>{
    if(step>1) setStep(step-1)
  }
  return (

    <Side >
       <div className='w-80vw '>
       <div className='w-[100%] h-[90vh] bg-[#EDF4F9] shadow-xl border border-gray-200 rounded-xl relative'>
      <h1 className='text-[35px] text-[#00428C] font-bold flex justify-center'>Préinscription</h1>
      <Steps step={step} />
      
      {step === 1 && <Etape1 nextStep={nextStep} setFormData={setFormData} formData={formData}/>}
      {step === 2 && <Etape2 nextStep={nextStep} prevStep={prevStep} formData={formData} />}
      {step === 3 && <Etape3 prevStep={prevStep} formData={formData} setFormData={setFormData}/>}
      
      </div>
      </div>
  
    </Side>
  )
}

export default Preinscription
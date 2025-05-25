import React, { useState } from 'react'
import axios from "axios";
import { CiSearch } from "react-icons/ci";
import Side from '../components/Side'
import Steps from '../components/Steps'
import Etape1 from '../components/Etape1'
import Etape2 from '../components/Etape2'
import Etape3 from '../components/Etape3'

const Preinscription = () => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    numSecurite: "", 
    enfantSelectionne: null, 
    infosSupplementaires: {}
  })

  const nextStep = () => {
    if(step < 3) setStep(step + 1);
  }

  const prevStep = () => {
    if(step > 1) setStep(step - 1)
  }

  return (
    <Side>
      <div className="min-h-screen  p-6">
        <div className="max-w-5xl mx-auto">
          <div className='bg-white rounded-2xl shadow-[0_10px_50px_rgba(8,_112,_184,_0.2)] overflow-hidden transform hover:scale-[1.01] transition-all duration-300'>
            <div className='p-8'>
              <h1 className='text-4xl font-bold text-center mb-8'>
                <span className="bg-gradient-to-r from-[#00428C] to-[#006DB8] text-transparent bg-clip-text">
                  Préinscription
                </span>
              </h1>
              
              <Steps step={step} />
            </div>

            {/* Zone de contenu défilable avec animation de transition */}
            <div className='px-8 pb-8 min-h-[500px] relative'>
              <div className={`transition-opacity duration-300 ${step === 1 ? 'opacity-100' : 'opacity-0 absolute'}`}>
                {step === 1 && <Etape1 nextStep={nextStep} setFormData={setFormData} formData={formData}/>}
              </div>
              <div className={`transition-opacity duration-300 ${step === 2 ? 'opacity-100' : 'opacity-0 absolute'}`}>
                {step === 2 && <Etape2 nextStep={nextStep} prevStep={prevStep} formData={formData} />}
              </div>
              <div className={`transition-opacity duration-300 ${step === 3 ? 'opacity-100' : 'opacity-0 absolute'}`}>
                {step === 3 && <Etape3 prevStep={prevStep} formData={formData} setFormData={setFormData}/>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Side>
  )
}

export default Preinscription
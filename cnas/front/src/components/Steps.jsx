import React from 'react'
import { FaChild, FaSearch, FaClipboardList } from 'react-icons/fa'

const Steps = ({step}) => {
  const steps = [
    { number: 1, icon: <FaSearch className="w-5 h-5" />, label: "Recherche" },
    { number: 2, icon: <FaChild className="w-5 h-5" />, label: "Sélection" },
    { number: 3, icon: <FaClipboardList className="w-5 h-5" />, label: "Informations" }
  ]

  return (
    <div className='max-w-3xl mx-auto'>
      <div className='flex justify-between items-center relative'>
        {/* Ligne de progression */}
        <div className='absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-1 bg-gray-200'>
          <div 
            className='h-full bg-[#006DB8] transition-all duration-500 ease-in-out'
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          />
        </div>

        {/* Étapes */}
        {steps.map((s, index) => (
          <div key={s.number} className='relative z-10 flex flex-col items-center gap-2'>
            <div 
              className={`
                w-14 h-14 rounded-full flex items-center justify-center
                transition-all duration-500 ease-in-out transform
                ${step >= s.number 
                  ? 'bg-[#006DB8] text-white scale-110' 
                  : 'bg-white text-[#006DB8] border-2 border-[#00428C]'
                }
                ${step === s.number ? 'ring-4 ring-[#006DB8]/20' : ''}
                hover:scale-105
              `}
            >
              {s.icon}
            </div>
            <span 
              className={`
                text-sm font-medium transition-all duration-500
                ${step >= s.number ? 'text-[#006DB8]' : 'text-gray-500'}
              `}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Steps
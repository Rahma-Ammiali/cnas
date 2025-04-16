import React, { useState } from 'react'

const Steps = ({step}) => {
  return (
    <>
    <div className='flex flex-col items-center justify-center space-y-4'>
        <div className='flex item-center'>
            {[1,2,3].map((num)=>(
                <div key={num} className='flex items-center'>
                    <div className={`w-10 h-10 font-bold flex items-center justify-center rounded-full border-2 transition-all
                        ${step >=num ? "bg-[#006DB8] text-white  border-[#006DB8] ": "bg-white text-[#006DB8] border-[#00428C]"}`}>
                            {num}
                        </div>
                        {num < 3 && <div className='w-15 h-[2px] bg-gray-400'></div>}
                </div>
            ))}

        </div>
        {/* <div className='flex space-x-4'>
            <button onClick={handleNext} className='px-4 py-2 bg-gray-300 rounded' disabled={step ===3}>Suivant</button>
            <button onClick={handlePrevious} className='px-2 py-2 bg-gray-300 rounded ' disabled={step===1}>retourner</button>
        </div> */}
    </div>
    </>
  )
}

export default Steps
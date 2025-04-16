import React from 'react'
import { useState } from 'react'
import { IoLogOutOutline } from "react-icons/io5";
import { CiUser , CiStopwatch, CiCalendarDate} from "react-icons/ci";
import { FaRegPenToSquare } from "react-icons/fa6";
import { GoHome } from "react-icons/go";
import { PiChartDonut } from "react-icons/pi";
import { BsFiles } from "react-icons/bs";
import { Link, useLocation } from "react-router-dom"; 
import toggle from '../assets/img.png'
import logo from '../assets/logo.png'


const Side = ({children}) => {
    const [open,setOpen] = useState(true);
    const location = useLocation();
    const Menus = [
        {title : "Acceuil" , icone : <GoHome  className='w-6 h-6 text-[#00428C]'/> ,path : "/Acceuil"},
        {title : "Tableau de bord" , icone : <PiChartDonut className='w-6 h-6 text-[#00428C]'/> , path:"/Dashboard"},
        {title : "Préinscription" , icone : <FaRegPenToSquare className='w-6 h-6  text-[#00428C]'/> , path:"/Preinscription"},
        {title : "Liste D'attente" , icone : <CiStopwatch className='w-6 h-6 md:w-8  md:h-9 text-[#00428C]'/> , path:"/EnAttente"},
        {title : "Dossiers" , icone : <BsFiles className='w-6 h-6 text-[#00428C]'/> , path:"/Dossiers"},
        {title : "Nouveau Utilisateur" , icone : <CiUser className='w-6  md:w-9 md:h-9 text-[#00428C]'/> , path:"/Utilisateur"},
        {title : "Evenements et Places", icone : <CiCalendarDate className='w-6 h-6 md:w-9 md:h-9 text-[#00428C]'/> ,path:"/Evenement"}
    ]
  return (
    <div className='flex'>
        {/* sidebar */}
        <div
        className={`${open ? 'lg:w-[13vw] md:w-[20vw] sm:w-[25vw]' :'w-[8%]'} p-[1.5%] pt-0 duration-300 h-screen bg-white drop-shadow-xl relative`}
        >
            {/* toggle button  */}
            <img src={toggle} className={`absolute cursor-pointer -right-3 rounded-full top-9 ${open ? 'w-7' : 'w-6'} border-2 border-[#00428C]  ${!open && 'rotate-180'}`}
            alt='toggle sidebar'
            onClick={()=>setOpen(!open)}
            />
            <div className="overflow-y-scroll h-full pb-10">
                <div className='items-center mt-2 mb-6 justify-center flex duration-500 ease-in-out'>
                    <img 
                    className={`cursor-pointer mr-2  ${open ? 'w-10' : 'w-12'} ${!open && "rotate-360deg"}`}
                    src={logo} 
                    alt="cnas-logo" />
                    <p className={`${open ? 'text-sm font-semibold':'hidden'} ` }>la caisse nationale des travailleurs salariés </p>
                </div>
                <hr className='border-gray-500 mb-6' />
                {/* menu items */}
                <ul className='pl-0 '>
                    {Menus.map((menu,index) =>(
                        <Link to={menu.path} key={index}>
                        <li 
                        className={`w-[100%]  text-gray-300 text-sm flex items-center gap-x-6 cursor-pointer ${open ? 'p-2 mt-0' :'pt-2 pb-2 mt-2 justify-center '} rounded-md 
                            ${location.pathname === menu.path ? 'bg-white' : ''} hover:bg-[#86BFE5]  
                        `}>
                            {menu.icone}
                            
                            <span className={`${!open && 'hidden'} origin-left duration-200 text-[#00428C] text-base sm:text-l ${open ? 'text-[24px] sm:text-xs ' : ''}  `}>{menu.title}</span>

                        </li>
                        </Link>
                    ))} 

                </ul>

            </div>
        </div>
        <div className='flex-1 p-8'>
            {children}
        </div>
    </div>
  )
}

export default Side
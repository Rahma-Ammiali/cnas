import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { IoLogOutOutline } from "react-icons/io5";
import { CiUser, CiStopwatch, CiCalendarDate } from "react-icons/ci";
import { FaRegPenToSquare, FaMoon, FaSun } from "react-icons/fa6";
import { GoHome } from "react-icons/go";
import { BsFiles } from "react-icons/bs";
import { MdBarChart } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import toggle from '../assets/img.png'
import logo from '../assets/logo.png'

const Side = ({children}) => {
    const [open, setOpen] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const Menus = [
        {title: "Acceuil", icone: <GoHome className='w-5 h-5 text-[#00428C] transition-transform group-hover:scale-110'/>, path: "/Acceuil"},
        {title: "Préinscription", icone: <FaRegPenToSquare className='w-5 h-5 text-[#00428C] transition-transform group-hover:scale-110'/>, path: "/Preinscription"},
        {title: "Liste D'attente", icone: <CiStopwatch className='w-5 h-5 text-[#00428C] transition-transform group-hover:scale-110'/>, path: "/EnAttente"},
        {title: "Dossiers", icone: <BsFiles className='w-5 h-5 text-[#00428C] transition-transform group-hover:scale-110'/>, path: "/Dossiers"},
        {title: "Nouveau Utilisateur", icone: <CiUser className='w-5 h-5 text-[#00428C] transition-transform group-hover:scale-110'/>, path: "/Utilisateur"},
        {title: "Evenements et Places", icone: <CiCalendarDate className='w-5 h-5 text-[#00428C] transition-transform group-hover:scale-110'/>, path: "/Evenement"},
        {title: "Statistiques", icone: <MdBarChart className='w-5 h-5 text-[#00428C] transition-transform group-hover:scale-110'/>, path: "/statistiques"},
        {title: "Enfants sortis", icone: <BsFiles className='w-5 h-5 text-[#00428C] transition-transform group-hover:scale-110'/>, path: "/enfants-sortis"},

    ];
                            {/* <button className={`
                            w-full px-3 py-2.5 rounded-lg
                            flex items-center gap-x-4
                            text-red-600 hover:bg-red-50
                            transition-all duration-300
                            group
                            ${!open && 'justify-center'}
                        `}>
                            <IoLogOutOutline className='w-5 h-5 transition-transform group-hover:scale-110'/>
                            <span className={`
                                font-medium text-sm
                                transition-all duration-300
                                whitespace-nowrap
                                ${!open && 'hidden'}
                            `}>
                                Déconnexion
                            </span>
                        </button> */}

    return (
        <div className='flex min-h-screen bg-gray-50'>
            <div 
                className={`
                    ${open ? 'w-64' : 'w-20'} 
                    min-h-screen bg-white 
                    shadow-[4px_0_6px_-1px_rgba(0,66,140,0.1)] 
                    fixed left-0 top-0 z-50
                    transition-all duration-300 ease-in-out
                    flex flex-col
                `}
            >
                <button
                    className={`
                        absolute -right-3 top-9 
                        bg-white rounded-full p-1.5
                        shadow-[0_2px_10px_-1px_rgba(0,66,140,0.2)]
                        border border-[#00428C]/20
                        transition-all duration-300 ease-in-out
                        hover:shadow-[0_4px_12px_-1px_rgba(0,66,140,0.3)]
                        hover:border-[#00428C]/40
                        cursor-pointer
                        ${!open && 'rotate-180'}
                    `}
                    onClick={() => setOpen(!open)}
                >
                    <img 
                        src={toggle} 
                        className='w-5 h-5 transition-transform duration-300'
                        alt='toggle sidebar'
                    />
                </button>

                <div className="flex-1 flex flex-col p-4">
                    <div className='flex items-center gap-3 py-4'>
                        <img 
                            className={`
                                ${open ? 'w-16' : 'w-12'} 
                                transition-all duration-300 
                                hover:scale-110
                            `}
                            src={logo} 
                            alt="cnas-logo" 
                        />
                        <div className={`
                            ${open ? 'opacity-100 text-sm font-medium' : 'opacity-0 w-0'} 
                            text-[#00428C] transition-all duration-300
                            leading-tight whitespace-normal
                        `}>
                            <p>Caisse Nationale</p>
                            <p>des Assurances Sociales</p>
                        </div>
                    </div>

                    <div className='h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-4'></div>

                    <ul className='flex-1 space-y-2'>
                        {Menus.map((menu, index) => (
                            <Link to={menu.path} key={index}>
                                <li className={`
                                    group
                                    flex items-center gap-x-4
                                    px-3 py-2.5 rounded-lg
                                    transition-all duration-300 ease-in-out
                                    cursor-pointer
                                    whitespace-nowrap
                                    ${location.pathname === menu.path 
                                        ? 'bg-[#00428C]/10 shadow-sm' 
                                        : 'hover:bg-[#00428C]/5'
                                    }
                                    ${!open && 'justify-center'}
                                    
                                    
                                `}>
                                    <span className="min-w-[24px] flex justify-center">
                                        {menu.icone}
                                    </span>
                                    <span className={`
                                        text-[#00428C]
                                        font-medium text-sm
                                        transition-all duration-300
                                        ${!open && 'hidden'}
                                        ${location.pathname === menu.path ? 'text-[#00428C]' : 'text-[#00428C]/70'}
                                        group-hover:text-[#00428C]
                                    `}>
                                        {menu.title}
                                    </span>
                                </li>
                            </Link>
                        ))}
                    </ul>

                    <div className='space-y-4 mt-auto'>
                        <button 
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className={`
                                w-full px-3 py-2.5 rounded-lg
                                flex items-center gap-x-4
                                text-[#00428C] hover:bg-[#00428C]/5
                                transition-all duration-300
                                group
                                ${!open && 'justify-center'}
                            `}
                        >
                            {isDarkMode ? (
                                <>
                                    <FaSun className='w-5 h-5 transition-transform group-hover:scale-110'/>
                                    <span className={`
                                        font-medium text-sm
                                        transition-all duration-300
                                        whitespace-nowrap
                                        ${!open && 'hidden'}
                                    `}>
                                        Mode clair
                                    </span>
                                </>
                            ) : (
                                <>
                                    <FaMoon className='w-5 h-5 transition-transform group-hover:scale-110'/>
                                    <span className={`
                                        font-medium text-sm
                                        transition-all duration-300
                                        whitespace-nowrap
                                        ${!open && 'hidden'}
                                    `}>
                                        Mode sombre
                                    </span>
                                </>
                            )}
                        </button>

                        {/* <Link to="/" className={`
                            w-full px-3 py-2.5 rounded-lg
                            flex items-center gap-x-4
                            text-red-600 hover:bg-red-50
                            transition-all duration-300
                            group
                            ${!open && 'justify-center'}
                        `}>
                            <IoLogOutOutline className='w-5 h-5 transition-transform group-hover:scale-110'/>
                            <span className={`
                                font-medium text-sm
                                transition-all duration-300
                                whitespace-nowrap
                                ${!open && 'hidden'}
                            `}>
                                Déconnexion
                            </span>
                        </Link>
                         */}
                         <button 
                         onClick={()=>{
                            const confirmLogout = window.confirm("voulez-vous vraiment vous déconnecter ?")
                            if(confirmLogout) {
                                navigate("/");
                            }
                        }}
                        className={`
                        w-full px-3 py-2.5 rounded-lg
                        flex items-center gap-x-4
                        text-red-600 hover:bg-red-100
                        transition-all duration-300
                        group
                        ${!open && 'justify-center'}
                    `}
                         >
                            <IoLogOutOutline className='w-5 h-5 transition-transform group-hover:scale-110'/>
                            <span className={`
                                font-medium text-sm
                                transition-all duration-300
                                whitespace-nowrap
                                ${!open && 'hidden'}
                            `}>
                                Déconnexion
                            </span>

                         </button>


                    </div>
                </div>
            </div>

            <div className={`
                flex-1 
                transition-all duration-300
                ${open ? 'ml-64' : 'ml-20'}
            `}>
                <div className='p-8 min-h-screen'>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Side;
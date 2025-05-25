import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Side from '../components/Side'
import { CiSearch } from "react-icons/ci";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

const Dossiers = () => {
  const [classeSelectionnee, setClasseSelectionnee] = useState('Tous');
  const [dossiers, setDossiers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('nom');
  const [sortOrder, setSortOrder] = useState('asc');
  const navigate = useNavigate();

  const fetchDossiers = (section) => {
    const url = section === 'Tous' 
      ? "http://localhost:5000/api/dossiers/valides"
      : `http://localhost:5000/api/dossiers/valides?section=${encodeURIComponent(section)}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setDossiers(data); // Plus de filtrage ici, on fait confiance au backend
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchDossiers(classeSelectionnee);
  }, [classeSelectionnee]);

  const handleDetails = (id) => {
    navigate(`/dossiers/${id}`)
  }

  const handleSort = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  const getFilteredAndSortedEnfants = () => {
    let filtered = dossiers;

    // Filtrage par recherche
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(e => 
        e.nom.toLowerCase().includes(searchLower) ||
        e.prenom.toLowerCase().includes(searchLower)
      );
    }

    // Tri
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'age') {
        const ageA = calculerAge(a.date_naissance) || 0;
        const ageB = calculerAge(b.date_naissance) || 0;
        return sortOrder === 'asc' ? ageA - ageB : ageB - ageA;
      } else if (sortBy === 'nom') {
        const nameA = `${a.nom} ${a.prenom}`.toLowerCase();
        const nameB = `${b.nom} ${b.prenom}`.toLowerCase();
        return sortOrder === 'asc' 
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      }
      return 0;
    });

    return sorted;
  }

  const calculerAge = (date_naissance) => {
    const birthDate = new Date(date_naissance);
    if (isNaN(birthDate.getTime())) {
      console.error("date de naissance invalide :", date_naissance);
      return null;
    }
    const adjustedDate = new Date(
      birthDate.getUTCFullYear(),
      birthDate.getUTCMonth(),
      birthDate.getUTCDate()
    )
    const today = new Date();
    let age = today.getFullYear() - adjustedDate.getFullYear();
    const monthDiff = today.getMonth() - adjustedDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < adjustedDate.getDate())) {
      age--;
    }
    return age;
  }

  return (
    <Side>
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold text-center">
            <span className="bg-gradient-to-r from-[#00428C] to-[#006DB8] text-transparent bg-clip-text">
              Dossiers Des Enfants
            </span>
          </h2>

          <div className="bg-white rounded-xl p-6 shadow-[0_4px_10px_rgba(8,_112,_184,_0.2)]">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              {/* Barre de recherche */}
              <div className="relative w-full md:w-1/3">
                <input
                  type="text"
                  placeholder="Rechercher par nom ou prénom..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 bg-[#DAEAF4] rounded-lg 
                    text-[#00428C] placeholder-[#00428C]/50
                    focus:outline-none focus:ring-2 focus:ring-[#006DB8] 
                    transition-all duration-300
                    pr-12"
                />
                <CiSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-[#00428C]" />
              </div>

              {/* Menu de tri */}
              <div className="flex gap-4 items-center">
                <span className="text-[#00428C] font-medium">Trier par:</span>
                <button
                  onClick={() => handleSort('nom')}
                  className={`
                    px-4 py-2 rounded-lg flex items-center gap-2
                    transition-all duration-300
                    ${sortBy === 'nom' 
                      ? 'bg-[#00428C] text-white shadow-md'
                      : 'bg-[#DAEAF4] text-[#00428C] hover:bg-[#00428C]/10'
                    }
                  `}
                >
                  Nom
                  {sortBy === 'nom' && (
                    sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />
                  )}
                </button>
                <button
                  onClick={() => handleSort('age')}
                  className={`
                    px-4 py-2 rounded-lg flex items-center gap-2
                    transition-all duration-300
                    ${sortBy === 'age' 
                      ? 'bg-[#00428C] text-white shadow-md'
                      : 'bg-[#DAEAF4] text-[#00428C] hover:bg-[#00428C]/10'
                    }
                  `}
                >
                  Âge
                  {sortBy === 'age' && (
                    sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-6 items-center justify-center bg-white rounded-lg p-4 shadow-md">
            <button
              className={`
                px-4 py-2 rounded-lg transition-all duration-300
                ${classeSelectionnee === 'Tous' 
                  ? 'bg-[#00428C] text-white font-medium shadow-md'
                  : 'text-[#00428C] hover:bg-[#00428C]/10'
                }
              `}
              onClick={() => setClasseSelectionnee('Tous')}
            >
              Tous
            </button>
            {['Petite Section', 'Moyenne Section', 'Grande Section'].map(classe => (
              <button
                key={classe}
                className={`
                  px-4 py-2 rounded-lg transition-all duration-300
                  ${classeSelectionnee === classe 
                    ? 'bg-[#00428C] text-white font-medium shadow-md'
                    : 'text-[#00428C] hover:bg-[#00428C]/10'
                  }
                `}
                onClick={() => setClasseSelectionnee(classe)}
              >
                {classe}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(8,_112,_184,_0.2)] overflow-hidden">
            <div className="max-h-[60vh] overflow-y-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#00428C]/5">
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#00428C]">Nom</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#00428C]">Prénom</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#00428C]">Âge</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#00428C]">Section</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#00428C]">Sexe</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#00428C]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {getFilteredAndSortedEnfants().map((e) => (
                    <tr 
                      key={`${e.id}-${e.date_depot}`}
                      className="hover:bg-[#00428C]/5 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{e.nom}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{e.prenom}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{calculerAge(e.date_naissance)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{e.classe}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{e.sexe}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleDetails(e.id)}
                          className="
                            px-4 py-2 rounded-lg
                            bg-[#00428C] text-white
                            hover:bg-[#006DB8]
                            transition-all duration-300
                            transform hover:scale-105
                          "
                        >
                          Voir plus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Side>
  )
}

export default Dossiers
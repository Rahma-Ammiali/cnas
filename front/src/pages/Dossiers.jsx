import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Side from '../components/Side'

const Dossiers = () => {
  const [classeSelectionnee, setClasseSelectionnee] = useState('Tous');
  const [dossiers, setDossiers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('nom');
  const [sortOrder, setSortOrder] = useState('asc');
  const navigate = useNavigate();

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

  const estDansSection = (age, section) => {
    switch (section) {
      case 'Petite section':
        return age >= 2 && age <= 3;
      case 'Moyenne section':
        return age >= 4 && age < 5;
      case 'Grande section':
        return age >= 5 && age <= 6;
      case 'Tous':
        return true;
      default:
        return false;
    }
  }

  useEffect(() => {
    fetch("http://localhost:5000/api/Dossiers/valides")
      .then(res => res.json())
      .then(data => {
        // Calculer l'âge pour chaque enfant une seule fois
        const dossiersAvecAge = data.map(enfant => ({
          ...enfant,
          age: calculerAge(enfant.date_naissance)
        }));
        setDossiers(dossiersAvecAge);
      })
      .catch((err) => console.error(err));
  }, [])

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

    // Filtrage par classe basé sur l'âge
    if (classeSelectionnee !== 'Tous') {
      filtered = filtered.filter(e => estDansSection(e.age, classeSelectionnee));
    }

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
        const ageA = a.age || 0;
        const ageB = b.age || 0;
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

  const getSectionParAge = (age) => {
    if (age >= 2 && age <= 3) return 'Petite section';
    if (age >= 4 && age < 5) return 'Moyenne section';
    if (age >= 5 && age <= 6) return 'Grande section';
    return 'Non défini';
  }

  return (
    <Side>
      <div className='relative'>
        <h2 className='text-[35px] text-[#00428C] font-bold mb-4'>Dossiers Des Enfants</h2>

        <div className='flex justify-between items-center mb-4'>
          {/* Barre de recherche */}
          <div className='relative w-1/3'>
            <input
              type="text"
              placeholder="Rechercher par nom ou prénom..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute right-3 top-2.5">🔍</span>
          </div>

          {/* Menu de tri */}
          <div className='flex gap-4 items-center'>
            <span className='text-gray-700'>Trier par:</span>
            <button
              onClick={() => handleSort('nom')}
              className={`px-4 py-2 rounded ${
                sortBy === 'nom' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              Nom {sortBy === 'nom' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => handleSort('age')}
              className={`px-4 py-2 rounded ${
                sortBy === 'age' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              Âge {sortBy === 'age' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
          </div>
        </div>

        <div>
          <div className='w-[100%] flex gap-5 mb-3'>
            <button
              className={`${classeSelectionnee === 'Tous' ? 'text-[#006DB8] font-bold text-xl decoration-solid underline' : 'text-gray-500 text-xl'} cursor-pointer`}
              onClick={() => setClasseSelectionnee('Tous')}
            >
              Tous
            </button>
            {['Petite section', 'Moyenne section', 'Grande section'].map(classe => (
              <button
                key={classe}
                className={`${classeSelectionnee === classe ? 'text-[#006DB8] font-bold text-xl decoration-solid underline' : 'text-gray-500 text-xl'} cursor-pointer`}
                onClick={() => setClasseSelectionnee(classe)}
              >
                {classe}
              </button>
            ))}
          </div>
        </div>

        <div className='overflow-hidden'>
          <div className='max-h-[60vh] overflow-y-auto border-gray-200 border rounded-xl'>
            <table className='w-full'>
              <thead>
                <tr className='border-gray-200 border shadow-md bg-[#FEFDFF]'>
                  <th className='w-1/6 px-4 py-2'>Nom</th>
                  <th className='w-1/6 px-4 py-2'>Prénom</th>
                  <th className='w-1/6 px-4 py-2'>Âge</th>
                  <th className='w-1/6 px-4 py-2'>Section</th>
                  <th className='w-1/6 px-4 py-2'>Sexe</th>
                  <th className='w-1/6 px-4 py-2'>Action</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredAndSortedEnfants().map((e) => (
                  <tr key={e.id} className='border border-gray-200 w-[100%] hover:bg-gray-50'>
                    <td className='w-1/6 px-4 py-2 text-center'>{e.nom}</td>
                    <td className='w-1/6 px-4 py-2 text-center'>{e.prenom}</td>
                    <td className='w-1/6 px-4 py-2 text-center'>{e.age}</td>
                    <td className='w-1/6 px-4 py-2 text-center'>{getSectionParAge(e.age)}</td>
                    <td className='w-1/6 px-4 py-2 text-center'>{e.sexe}</td>
                    <td className='w-1/6 px-4 py-2 text-center'>
                      <button
                        className='bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow-sm cursor-pointer'
                        onClick={() => handleDetails(e.id)}>
                        voir plus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Side>
  )
}

export default Dossiers
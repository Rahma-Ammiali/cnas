import React, { useEffect, useState } from 'react'
import Side from '../components/Side'
import DetailsModal from '../components/DetailsModal';
import { useNavigate } from 'react-router-dom';

const EnAttente = () => {
  const navigate = useNavigate();
  const [classeSelectionnee, setClasseSelectionnee] = useState('Tous');
  const [preinscription, setPreinscription] = useState([]);
  const [status, setStatus] = useState({});
  const [selectedId, setSelectedId] = useState(null);
  const [placesRestantes, setPlacesRestantes] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });

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

  const fetchPreinscriptions = () => {
    fetch("http://localhost:5000/api/preinscription/nonValidees")
      .then(res => res.json())
      .then(data => {
        setPreinscription(data);
        const initialStatus = {};
        data.forEach(element => {
          initialStatus[element.id_preinscription] = "non validé"
        });
        setStatus(initialStatus);
      })
      .catch((err) => {
        console.error(err);
        setMessage({ type: 'error', text: 'Erreur lors de la récupération des préinscriptions' });
      });
  };

  const fetchPlacesRestantes = () => {
    fetch("http://localhost:5000/api/preinscription/places")
      .then(res => res.json())
      .then(data => {
        setPlacesRestantes(data);
      })
      .catch(err => {
        console.error("erreur lors de la recuperation des places restantes :", err)
      });
  };

  useEffect(() => {
    fetchPreinscriptions();
    fetchPlacesRestantes();
  }, []);

  const handleValidation = async (id_preinscription, classe, enfant) => {
    try {
      const response = await fetch("http://localhost:5000/api/preinscription/valider", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_preinscription, classe }),
      });

      const data = await response.json();

      if (data.status === "validee") {
        // Mettre à jour le statut localement
        setStatus(prev => ({ ...prev, [id_preinscription]: "validé" }));
        
        // Mettre à jour la liste des préinscriptions
        setPreinscription(prev => prev.filter(p => p.id_preinscription !== id_preinscription));
        
        // Mettre à jour les places restantes
        fetchPlacesRestantes();

        // Afficher le message de confirmation
        setMessage({
          type: 'success',
          text: `La préinscription de ${enfant.prenom} ${enfant.nom} a été validée avec succès`
        });

        // Rediriger vers la page des dossiers après 2 secondes
        setTimeout(() => {
          navigate('/Dossiers');
        }, 2000);
      } else if (data.status === "saturee") {
        setStatus(prev => ({ ...prev, [id_preinscription]: "saturé" }));
        fetchPlacesRestantes();
        setMessage({
          type: 'error',
          text: 'Cette classe est saturée, impossible de valider l\'inscription'
        });
      }
    } catch (err) {
      console.error("Erreur lors de la validation:", err);
      setMessage({
        type: 'error',
        text: 'Une erreur est survenue lors de la validation'
      });
    }
  };

  const handleVoirPlus = (id) => {
    setSelectedId(id);
  };

  const getFilteredPreinscriptions = () => {
    if (classeSelectionnee === 'Tous') {
      return preinscription;
    }
    return preinscription.filter(e => e.classe === classeSelectionnee);
  };

  // Effet pour effacer le message après 3 secondes
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <Side>
      <div className='relative'>
        <h2 className='text-[35px] text-[#00428C] font-bold mb-4'>Validation des préinscriptions</h2>
        
        {/* Message de confirmation/erreur */}
        {message.text && (
          <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
            message.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white z-50 animate-fade-in-out`}>
            {message.text}
          </div>
        )}

        <div className='w-[80vw]'>
          <div className='flex justify-between'>
            {placesRestantes.map(classe => (
              <div key={classe.nom_classe} className='border border-gray-200 shadow-md bg-[white] w-[20vw] h-[6vw] shadow-md rounded-xl p-4 mb-4 text-[#006DB8] font-bold'>
                <h3>{classe.nom_classe}</h3>
                <p>{classe.nbr_places} places restantes</p>
              </div>
            ))}
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
                  <th className='w-1/6 px-4 py-2'>Classe</th>
                  <th className='w-1/6 px-4 py-2'>Statut</th>
                  <th className='w-1/6 px-4 py-2'>Voir plus</th>
                  <th className='w-1/6 px-4 py-2'>Action</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredPreinscriptions().map((e) => (
                  <tr key={e.id_preinscription} className='border border-gray-200'>
                    <td className='w-1/6 px-4 py-2 text-center'>{e.nom}</td>
                    <td className='w-1/6 px-4 py-2 text-center'>{e.prenom}</td>
                    <td className='w-1/6 px-4 py-2 text-center'>{calculerAge(e.date_naissance)}</td>
                    <td className='w-1/6 px-4 py-2 text-center'>{e.classe}</td>
                    <td className='w-1/6 px-4 py-2 text-center'>{status[e.id_preinscription]}</td>
                    <td className='w-1/6 px-4 py-2 text-center'>
                      <button
                        className='bg-blue-400 hover:bg-blue-500 text-white px-3 py-1 rounded shadow-sm cursor-pointer'
                        onClick={() => handleVoirPlus(e.id_preinscription)}>
                        Voir plus
                      </button>
                    </td>
                    <td className='w-1/6 px-4 py-2 text-center'>
                      {status[e.id_preinscription] === "validé" ? (
                        <button
                          className='text-white px-3 py-1 rounded shadow-sm bg-green-300 cursor-not-allowed'
                        >
                          Validé
                        </button>
                      ) : status[e.id_preinscription] === "saturé" ? (
                        <button
                          className='text-white px-3 py-1 rounded shadow-sm opacity-50 bg-gray-800 cursor-not-allowed'
                        >
                          Saturé
                        </button>
                      ) : (
                        <button
                          className='bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded shadow-sm cursor-pointer'
                          onClick={() => handleValidation(e.id_preinscription, e.classe, e)}>
                          Valider
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {selectedId && (
          <DetailsModal id={selectedId} onClose={() => setSelectedId(null)} />
        )}
      </div>
    </Side>
  );
};

export default EnAttente;
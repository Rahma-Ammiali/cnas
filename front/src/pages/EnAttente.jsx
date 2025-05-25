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
      <div className="min-h-screen bg-gradient-to-b from-white to-[#f0f7ff] p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold text-center mb-8">
            <span className="bg-gradient-to-r from-[#00428C] to-[#006DB8] text-transparent bg-clip-text">
              Validation des préinscriptions
            </span>
          </h2>
          
          {message.text && (
            <div className={`
              fixed top-4 right-4 p-4 rounded-lg shadow-lg
              ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}
              text-white z-50 transform transition-all duration-300
              animate-fade-in-out
            `}>
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {placesRestantes.map(classe => (
              <div key={classe.nom_classe} className="
                bg-white rounded-xl p-6
                shadow-[0_10px_30px_rgba(8,_112,_184,_0.2)]
                transform hover:scale-[1.02] transition-all duration-300
              ">
                <h3 className="text-xl font-bold text-[#00428C] mb-2">
                  {classe.nom_classe}
                </h3>
                <p className="text-[#006DB8] text-lg">
                  {classe.nbr_places} places restantes
                </p>
              </div>
            ))}
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
            {['Petite section', 'Moyenne section', 'Grande section'].map(classe => (
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
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#00428C]">Classe</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#00428C]">Statut</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#00428C]">Voir plus</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#00428C]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {getFilteredPreinscriptions().map(e => (
                    <tr 
                      key={e.id_preinscription}
                      className="hover:bg-[#00428C]/5 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{e.nom}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{e.prenom}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{calculerAge(e.date_naissance)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{e.classe}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`
                          px-3 py-1 rounded-full text-xs font-medium
                          ${status[e.id_preinscription] === "validé" 
                            ? 'bg-green-100 text-green-800'
                            : status[e.id_preinscription] === "saturé"
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                          }
                        `}>
                          {status[e.id_preinscription]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleVoirPlus(e.id_preinscription)}
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {status[e.id_preinscription] === "validé" ? (
                          <button className="
                            px-4 py-2 rounded-lg
                            bg-green-500 text-white
                            opacity-50 cursor-not-allowed
                          ">
                            Validé
                          </button>
                        ) : status[e.id_preinscription] === "saturé" ? (
                          <button className="
                            px-4 py-2 rounded-lg
                            bg-red-500 text-white
                            opacity-50 cursor-not-allowed
                          ">
                            Saturé
                          </button>
                        ) : (
                          <button
                            onClick={() => handleValidation(e.id_preinscription, e.classe, e)}
                            className="
                              px-4 py-2 rounded-lg
                              bg-green-500 text-white
                              hover:bg-green-600
                              transition-all duration-300
                              transform hover:scale-105
                            "
                          >
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
        </div>
        {selectedId && (
          <DetailsModal id={selectedId} onClose={() => setSelectedId(null)} />
        )}
      </div>
    </Side>
  );
};

export default EnAttente;
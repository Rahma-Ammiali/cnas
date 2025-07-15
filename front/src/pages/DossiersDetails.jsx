import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Side from '../components/Side';
import { IoArrowBack, IoPrint } from 'react-icons/io5';
import { FaChild, FaUserFriends, FaFileAlt, FaBrain } from 'react-icons/fa';

const DossierDetails = () => {
  const role = JSON.parse(localStorage.getItem("user"))?.role;

  useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user"))
  if (user) {
    console.log("👤 Rôle actuel :", user.role);
  } else {
    console.log("❌ Aucun utilisateur trouvé");
  }
}, []);

  const { id } = useParams();
  const navigate = useNavigate();
  const [dossier, setDossier] = useState(null);
  const [loading, setLoading] = useState(true);

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/api/dossiers/${id}`)
      .then(res => res.json())
      .then(data => {
        setDossier(data?.error ? null : data);
        setLoading(false);
      })
      .catch(err => {
        setDossier(null);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Side>
        <div className="min-h-screen bg-gradient-to-b from-white to-[#f0f7ff] p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-[60vh]">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#00428C]"></div>
            </div>
          </div>
        </div>
      </Side>
    );
  }

  if (!dossier) {
    return (
      <Side>
        <div className="min-h-screen bg-gradient-to-b from-white to-[#f0f7ff] p-6">
          <div className="max-w-7xl mx-auto text-center space-y-6">
            <h2 className="text-2xl font-bold text-[#00428C]">Dossier non trouvé</h2>
            <button 
              onClick={() => navigate(-1)}
              className="
                px-6 py-3 rounded-lg
                bg-[#00428C] text-white
                hover:bg-[#006DB8]
                transition-all duration-300
                transform hover:scale-105
                flex items-center gap-2 mx-auto
              "
            >
              <IoArrowBack className="w-5 h-5" />
              Retour
            </button>
          </div>
        </div>
      </Side>
    );
  }

  return (
    <Side>
      <div className="min-h-screen bg-gradient-to-b from-white to-[#f0f7ff] p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <button 
              onClick={() => navigate(-1)}
              className="
                px-6 py-3 rounded-lg
                bg-[#00428C] text-white
                hover:bg-[#006DB8]
                transition-all duration-300
                transform hover:scale-105
                flex items-center gap-2
              "
            >
              <IoArrowBack className="w-5 h-5" />
              Retour
            </button>
            <button
              onClick={handlePrint}
              className="
                px-6 py-3 rounded-lg
                bg-[#00428C] text-white
                hover:bg-[#006DB8]
                transition-all duration-300
                transform hover:scale-105
                flex items-center gap-2
              "
            >
              <IoPrint className="w-5 h-5" />
              Imprimer
            </button>
          </div>

          <h2 className="text-3xl font-bold text-center">
            <span className="bg-gradient-to-r from-[#00428C] to-[#006DB8] text-transparent bg-clip-text">
              Détails du Dossier
            </span>
          </h2>

          <div className="grid grid-cols-1 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-[0_10px_30px_rgba(8,_112,_184,_0.2)]">
              <div className="flex items-center gap-3 mb-6">
                <FaChild className="w-6 h-6 text-[#00428C]" />
                <h3 className="text-xl font-semibold text-[#00428C]">Information sur l'enfant</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="group">
                    <label className="text-sm text-[#00428C]/70 font-medium block mb-1">Nom</label>
                    <input 
                      type="text" 
                      value={dossier.nom || ''} 
                      readOnly 
                      className="w-full p-4 bg-[#DAEAF4] rounded-lg text-[#00428C] focus:outline-none" 
                    />
                  </div>
                  <div className="group">
                    <label className="text-sm text-[#00428C]/70 font-medium block mb-1">Prénom</label>
                    <input 
                      type="text" 
                      value={dossier.prenom || ''} 
                      readOnly 
                      className="w-full p-4 bg-[#DAEAF4] rounded-lg text-[#00428C] focus:outline-none" 
                    />
                  </div>
                  <div className="group">
                    <label className="text-sm text-[#00428C]/70 font-medium block mb-1">Date de naissance</label>
                    <input 
                      type="text" 
                      value={dossier.date_naissance || ''} 
                      readOnly 
                      className="w-full p-4 bg-[#DAEAF4] rounded-lg text-[#00428C] focus:outline-none" 
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="group">
                    <label className="text-sm text-[#00428C]/70 font-medium block mb-1">Situation Handicap</label>
                    <input 
                      type="text" 
                      value={dossier.handicap === 'Oui' ? dossier.handicap_details || 'Oui' : 'Non'} 
                      readOnly 
                      className="w-full p-4 bg-[#DAEAF4] rounded-lg text-[#00428C] focus:outline-none" 
                    />
                  </div>
                  <div className="group">
                    <label className="text-sm text-[#00428C]/70 font-medium block mb-1">Maladie Chronique</label>
                    <input 
                      type="text" 
                      value={dossier.maladie_chronique === 'Oui' ? dossier.maladie_details || 'Oui' : 'Non'} 
                      readOnly 
                      className="w-full p-4 bg-[#DAEAF4] rounded-lg text-[#00428C] focus:outline-none" 
                    />
                  </div>
                  <div className="group">
                    <label className="text-sm text-[#00428C]/70 font-medium block mb-1">Année Scolaire</label>
                    <input 
                      type="text" 
                      value={dossier.annee_scolaire || ''} 
                      readOnly 
                      className="w-full p-4 bg-[#DAEAF4] rounded-lg text-[#00428C] focus:outline-none" 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-[0_10px_30px_rgba(8,_112,_184,_0.2)]">
              <div className="flex items-center gap-3 mb-6">
                <FaUserFriends className="w-6 h-6 text-[#00428C]" />
                <h3 className="text-xl font-semibold text-[#00428C]">Informations sur les parents</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="group">
                    <label className="text-sm text-[#00428C]/70 font-medium block mb-1">Prénom du père</label>
                    <input 
                      type="text" 
                      value={dossier.prenom_pere || ''} 
                      readOnly 
                      className="w-full p-4 bg-[#DAEAF4] rounded-lg text-[#00428C] focus:outline-none" 
                    />
                  </div>
                  <div className="group">
                    <label className="text-sm text-[#00428C]/70 font-medium block mb-1">Nom et Prénom de la mère</label>
                    <input 
                      type="text" 
                      value={`${dossier.nom_mere || ''} ${dossier.prenom_mere || ''}`} 
                      readOnly 
                      className="w-full p-4 bg-[#DAEAF4] rounded-lg text-[#00428C] focus:outline-none" 
                    />
                  </div>
                  <div className="group">
                    <label className="text-sm text-[#00428C]/70 font-medium block mb-1">Numéro d'assurance de la mère</label>
                    <input 
                      type="text" 
                      value={dossier.assurance_mere_ou_employeur || ''} 
                      readOnly 
                      className="w-full p-4 bg-[#DAEAF4] rounded-lg text-[#00428C] focus:outline-none" 
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="group">
                    <label className="text-sm text-[#00428C]/70 font-medium block mb-1">Num tel du père</label>
                    <input 
                      type="text" 
                      value={dossier.telephone_pere || ''} 
                      readOnly 
                      className="w-full p-4 bg-[#DAEAF4] rounded-lg text-[#00428C] focus:outline-none" 
                    />
                  </div>
                  <div className="group">
                    <label className="text-sm text-[#00428C]/70 font-medium block mb-1">Num tel de la mère</label>
                    <input 
                      type="text" 
                      value={dossier.telephone_mere || ''} 
                      readOnly 
                      className="w-full p-4 bg-[#DAEAF4] rounded-lg text-[#00428C] focus:outline-none" 
                    />
                  </div>
                  <div className="group">
                    <label className="text-sm text-[#00428C]/70 font-medium block mb-1">Adresse</label>
                    <input 
                      type="text" 
                      value={dossier.adresse || ''} 
                      readOnly 
                      className="w-full p-4 bg-[#DAEAF4] rounded-lg text-[#00428C] focus:outline-none" 
                    />
                  </div>
                  <div className="group">
                    <label className="text-sm text-[#00428C]/70 font-medium block mb-1">Tarif Préférentiel</label>
                    <input 
                      type="text" 
                      value={dossier.tarif_preferentiel || ''} 
                      readOnly 
                      className="w-full p-4 bg-[#DAEAF4] rounded-lg text-[#00428C] focus:outline-none" 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              {(role === "educatrice" || role === "directrice" || role === "educatrice en chef" || role === "agent_cnas" ) && (
                <button
                onClick={() => navigate(`/pieces-jointes/${id}`)}
                className="
                  px-6 py-3 rounded-lg
                  bg-[#00428C] text-white
                  hover:bg-[#006DB8]
                  transition-all duration-300
                  transform hover:scale-105
                  flex items-center gap-2
                "
              >
                <FaFileAlt className="w-5 h-5" />
                Pièces jointes
              </button>
              )}
              
              {(role === "educatrice" || role === "directrice" || role === "educatrice en chef" || role === "agent_cnas" ) && (
                 <button
                onClick={() => navigate(`/suivi-pedagogique/${id}`)}
                className="
                  px-6 py-3 rounded-lg
                  bg-[#00428C] text-white
                  hover:bg-[#006DB8]
                  transition-all duration-300
                  transform hover:scale-105
                  flex items-center gap-2
                "
              >
                <FaBrain className="w-5 h-5" />
                Suivi Psychopédagogique
              </button>
              )}
             
            </div>
          </div>
        </div>
      </div>
    </Side>
  );
};

export default DossierDetails;

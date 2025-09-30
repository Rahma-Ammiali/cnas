import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Side from '../components/Side';
import { IoArrowBack, IoPrint } from 'react-icons/io5';
import { FaChild, FaUserFriends, FaFileAlt, FaBrain } from 'react-icons/fa';

const DossierDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dossier, setDossier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [historique, setHistorique] = useState([]);
  const [showSortieForm, setShowSortieForm] = useState(false);
  const [sortieDate, setSortieDate] = useState('');
  const [sortieRaison, setSortieRaison] = useState('');

  const handlePrint = () => {
    window.print();
  };

  const parseInputDateToYMD = (val) => {
    if (!val) return null;
    const trimmed = val.trim();
    // Accept YYYY-MM-DD
    const ymd = /^\d{4}-\d{2}-\d{2}$/;
    if (ymd.test(trimmed)) return trimmed;
    // Accept DD/MM/YYYY
    const dmy = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const m1 = trimmed.match(dmy);
    if (m1) {
      const dd = m1[1], mm = m1[2], yyyy = m1[3];
      return `${yyyy}-${mm}-${dd}`;
    }
    return null;
  };

  const formatDisplayDate = (val) => {
    if (!val) return '-';
    try {
      // Normalize to YYYY-MM-DD if needed
      let normalized = val;
      const isoDate = /^(\d{4})-(\d{2})-(\d{2})/;
      const m = String(val).match(isoDate);
      if (!m) return '-';
      // Use Date.UTC to avoid TZ shifts
      const d = new Date(Date.UTC(parseInt(m[1],10), parseInt(m[2],10)-1, parseInt(m[3],10)));
      if (isNaN(d.getTime())) return '-';
      return d.toLocaleDateString();
    } catch {
      return '-';
    }
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
    // fetch history
    fetch(`http://localhost:5000/api/dossiers/${id}/historique`)
      .then(r => r.json())
      .then(setHistorique)
      .catch(() => setHistorique([]))
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
              onClick={() => navigate('/dossiers')}
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
            <div className="flex items-center gap-3">
              {dossier?.date_sortie && (
                <span className="px-3 py-2 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm">
                  Sorti le {formatDisplayDate(dossier.date_sortie)}
                </span>
              )}
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
              <button
                onClick={() => setShowSortieForm(true)}
                className="
                  px-6 py-3 rounded-lg
                  bg-red-600 text-white
                  hover:bg-red-700
                  transition-all duration-300
                  transform hover:scale-105
                  flex items-center gap-2
                "
              >
                Définir date de sortie
              </button>
            </div>
          </div>

          {showSortieForm && (
            <div className="bg-white rounded-xl p-6 border border-red-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-[#00428C]/70 font-medium block mb-1">Date de sortie</label>
                  <input type="date" value={sortieDate} onChange={(e)=> setSortieDate(e.target.value)} className="w-full p-3 bg-[#DAEAF4] rounded-lg text-[#00428C] focus:outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-[#00428C]/70 font-medium block mb-1">Raison de sortie</label>
                  <input type="text" value={sortieRaison} onChange={(e)=> setSortieRaison(e.target.value)} placeholder="Raison (optionnel)" className="w-full p-3 bg-white border border-gray-200 rounded-lg" />
                </div>
              </div>
              <div className="mt-4 flex gap-3 justify-end">
                <button onClick={()=>{ setShowSortieForm(false); setSortieDate(''); setSortieRaison(''); }} className="px-4 py-2 rounded bg-gray-200">Annuler</button>
                <button
                  onClick={async () => {
                    if (!sortieDate) { alert('Veuillez choisir une date'); return; }
                    try {
                      const resp = await fetch(`http://localhost:5000/api/dossiers/${id}/sortie`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ date_sortie: sortieDate, raison: sortieRaison || null })
                      });
                      if (!resp.ok) {
                        const data = await resp.json().catch(() => ({}));
                        throw new Error(data.error || 'Erreur serveur');
                      }
                      alert('Sortie enregistrée');
                      setShowSortieForm(false);
                      setSortieDate(''); setSortieRaison('');
                      // refresh dossier + historique
                      setLoading(true);
                      fetch(`http://localhost:5000/api/dossiers/${id}`)
                        .then(res => res.json())
                        .then(data => { setDossier(data?.error ? null : data); setLoading(false); })
                        .catch(() => setLoading(false));
                      fetch(`http://localhost:5000/api/dossiers/${id}/historique`).then(r=>r.json()).then(setHistorique).catch(()=>{})
                    } catch (e) {
                      alert(e.message);
                    }
                  }}
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                >
                  Enregistrer la sortie
                </button>
              </div>
            </div>
          )}

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

            <div className="bg-white rounded-2xl p-8 shadow-[0_10px_30px_rgba(8,_112,_184,_0.2)]">
              <h3 className="text-xl font-semibold text-[#00428C] mb-4">Historique</h3>
              <div className="space-y-2">
                {dossier?.date_depot && (
                  <div className="text-sm">Dépôt de demande: <span className="font-medium">{new Date(dossier.date_depot).toLocaleDateString()}</span></div>
                )}
                {historique && historique.length > 0 ? (
                  historique.map((h, idx) => (
                    <div key={idx} className="text-sm">
                      {h.type === 'sortie' ? 'Sortie' : h.type === 'reinscription' ? 'Réinscription' : h.type}
                      : <span className="font-medium">{new Date(h.date_evenement).toLocaleDateString()}</span>
                      {h.details ? <span className="text-gray-500"> — {h.details}</span> : null}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500">Aucun événement</div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4">
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
              <button
                onClick={() => navigate(`/suivi-de-payement/${id}`)}
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
                Suivi De paiement 
              </button>
            </div>
          </div>
        </div>
      </div>
    </Side>
  );
};

export default DossierDetails;

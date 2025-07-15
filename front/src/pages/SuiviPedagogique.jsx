import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Side from '../components/Side';
import { FiEdit, FiSave, FiCheck, FiPrinter, FiArrowLeft } from 'react-icons/fi';

const SuiviPedagogique = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    obs_adaptation: '',
    statut_adaptation: '',
    obs_socialisation: '',
    statut_socialisation: '',
    obs_autonomie: '',
    statut_autonomie: '',
    obs_premath: '',
    statut_premath: '',
    obs_prelecture: '',
    statut_prelecture: '',
    obs_preecriture: '',
    statut_preecriture: '',
    evenements_places: '',
    date_observation: new Date().toISOString().split('T')[0]
  });
  const [statut_validation, setStatutValidation] = useState('En attente');

  useEffect(() => {
    fetchSuiviPedagogique();
  }, [id]);

  const fetchSuiviPedagogique = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/suivi-pedagogique/${id}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données');
      }
      const data = await response.json();
      if (data) {
        setFormData(data);
        setStatutValidation(data.statut_validation || 'En attente');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la récupération des données');
    }
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }
    try {
      const response = await fetch(`http://localhost:5000/api/suivi-pedagogique/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          date_observation: formData.date_observation || new Date().toISOString().split('T')[0]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'enregistrement');
      }

      alert('Suivi pédagogique enregistré avec succès');
      setIsEditing(false);
      fetchSuiviPedagogique();
    } catch (error) {
      console.error('Erreur:', error);
      alert(error.message || 'Erreur lors de l\'enregistrement');
    }
  };

  const handleValidation = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/suivi-pedagogique/${id}/valider`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const responseData = await response.json();
      
      if (response.ok) {
        alert('Suivi pédagogique validé avec succès');
        fetchSuiviPedagogique();
      } else {
        console.error('Erreur réponse:', responseData);
        alert('Erreur lors de la validation: ' + (responseData.error || 'Erreur inconnue'));
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la validation');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleChange = (e, field) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const StatutSelect = ({ field, value }) => {
    if (!isEditing) return (
      <span className={`px-3 py-1 rounded-full text-white text-sm font-medium shadow-sm ${
        value === 'Amélioration' ? 'bg-gradient-to-r from-green-500 to-green-600' :
        value === 'Stagnation' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
        value === 'Régression' ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gray-400'
      }`}>
        {value || 'Non évalué'}
      </span>
    );

    return (
      <select
        value={value || ''}
        onChange={(e) => handleChange(e,field)}
        className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm hover:shadow transition-all duration-200"
      >
        <option value="">Sélectionner</option>
        <option value="Amélioration">Amélioration</option>
        <option value="Stagnation">Stagnation</option>
        <option value="Régression">Régression</option>
      </select>
    );
  };

  const ObservationSection = ({ title, obsField, statutField }) => {
    return (
      <div className="mb-6 p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
          <StatutSelect
            field={statutField}
            value={formData[statutField] || ''}
/>

        </div>
        <textarea
          value={formData[obsField] || ''}
          onChange={(e) => handleChange(e, obsField)}
          disabled={!isEditing}
          className={`w-full p-4 border-2 rounded-xl min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
            isEditing ? 'bg-white border-blue-200 hover:border-blue-300' : 'bg-gray-50 border-gray-200'
          }`}
          placeholder={isEditing ? "Saisir vos observations..." : "Aucune observation"}
        />

      </div>
    );
  };

  return (
    <Side>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header fixe */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-md">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              {/* Titre et bouton retour */}
              <div className="flex flex-col space-y-2">
                <h2 className="text-2xl font-bold text-[#00428C]">
                  Suivi Psychologique et pédagogique
                </h2>
                <button
                  onClick={() => navigate(`/dossiers/${id}`)}
                  className="flex items-center text-blue-600 hover:text-blue-800 text-left transition-colors duration-200"
                >
                  <FiArrowLeft className="mr-1" /> Retour au dossier
                </button>
              </div>

              {/* Boutons d'action */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 ${
                    isEditing ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {isEditing ? (
                    <>
                      <FiEdit /> Annuler
                    </>
                  ) : (
                    <>
                      <FiEdit /> Modifier
                    </>
                  )}
                </button>

                {isEditing ? (
                  <button
                    onClick={handleSubmit}
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    <FiSave /> Enregistrer
                  </button>
                ) : (
                  <button
                    onClick={handleValidation}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 ${
                      statut_validation === 'Validé'
                        ? 'bg-gray-500 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                    disabled={statut_validation === 'Validé'}
                  >
                    <FiCheck />
                    {statut_validation === 'Validé' ? '✓ Validé' : 'Valider'}
                  </button>
                )}

                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-5 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <FiPrinter /> Imprimer
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu défilable */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="space-y-6">
            <ObservationSection
              title="Adaptation de l'enfant à la CJE"
              obsField="obs_adaptation"
              statutField="statut_adaptation"
            />
            
            <ObservationSection
              title="Relation aux autres enfants (socialisation)"
              obsField="obs_socialisation"
              statutField="statut_socialisation"
            />
            
            <ObservationSection
              title="Acquisition de l'autonomie dans la vie pratique"
              obsField="obs_autonomie"
              statutField="statut_autonomie"
            />
            
            <ObservationSection
              title="Acquisition des enseignements en pré mathématiques"
              obsField="obs_premath"
              statutField="statut_premath"
            />
            
            <ObservationSection
              title="Acquisition des enseignements en pré lecture"
              obsField="obs_prelecture"
              statutField="statut_prelecture"
            />
            
            <ObservationSection
              title="Acquisition des enseignements en pré écriture"
              obsField="obs_preecriture"
              statutField="statut_preecriture"
            />
          </div>
        </div>
      </div>
    </Side>
  );
};

export default SuiviPedagogique;
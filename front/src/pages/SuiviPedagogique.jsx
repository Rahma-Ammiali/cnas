import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Side from '../components/Side';

const SuiviPedagogique = () => {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [suivi, setSuivi] = useState({
    obs_adaptation: '',
    obs_socialisation: '',
    obs_autonomie: '',
    obs_premath: '',
    obs_prelecture: '',
    obs_preecriture: '',
    statut_adaptation: null,
    statut_socialisation: null,
    statut_autonomie: null,
    statut_premath: null,
    statut_prelecture: null,
    statut_preecriture: null
  });

  useEffect(() => {
    fetchSuivi();
  }, [id]);

  const fetchSuivi = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/suivi-pedagogique/${id}`);
      const data = await response.json();
      if (data) {
        setSuivi(data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du suivi:', error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/suivi-pedagogique/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(suivi),
      });
      
      if (response.ok) {
        setIsEditing(false);
        fetchSuivi();
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleChange = (e, field) => {
    const { value } = e.target;
    setSuivi(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const StatutSelect = ({ field, value }) => {
    if (!isEditing) return (
      <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
        value === 'Amélioration' ? 'bg-green-500' :
        value === 'Stagnation' ? 'bg-yellow-500' :
        value === 'Régression' ? 'bg-red-500' : 'bg-gray-400'
      }`}>
        {value || 'Non évalué'}
      </span>
    );

    return (
      <select
        value={value || ''}
        onChange={(e) => handleChange(e, `statut_${field}`)}
        className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
      <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
          <StatutSelect field={statutField} value={suivi[`statut_${statutField}`]} />
        </div>
        <textarea
          value={suivi[obsField] || ''}
          onChange={(e) => handleChange(e, obsField)}
          disabled={!isEditing}
          className={`w-full p-3 border rounded-lg min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
          }`}
          placeholder={isEditing ? "Saisir vos observations..." : "Aucune observation"}
        />
      </div>
    );
  };

  return (
    <Side>
      <div className="h-[calc(100vh-80px)] flex flex-col">
        <div className="p-6 bg-white border-b border-gray-200">
          <div className="flex justify-between items-center max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-[#00428C]">Suivi Psychologique et pédagogique</h2>
            <div className="space-x-3">
              <button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isEditing ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
                } text-white shadow-sm`}
              >
                {isEditing ? 'Enregistrer' : 'Modifier'}
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded-lg font-medium bg-gray-600 hover:bg-gray-700 text-white shadow-sm transition-colors"
              >
                Imprimer
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-6xl mx-auto space-y-6">
            <ObservationSection
              title="Adaptation de l'enfant à la CJE"
              obsField="obs_adaptation"
              statutField="adaptation"
            />
            
            <ObservationSection
              title="Relation aux autres enfants (socialisation)"
              obsField="obs_socialisation"
              statutField="socialisation"
            />
            
            <ObservationSection
              title="Acquisition de l'autonomie dans la vie pratique"
              obsField="obs_autonomie"
              statutField="autonomie"
            />
            
            <ObservationSection
              title="Acquisition des enseignements en pré mathématiques"
              obsField="obs_premath"
              statutField="premath"
            />
            
            <ObservationSection
              title="Acquisition des enseignements en pré lecture"
              obsField="obs_prelecture"
              statutField="prelecture"
            />
            
            <ObservationSection
              title="Acquisition des enseignements en pré écriture"
              obsField="obs_preecriture"
              statutField="preecriture"
            />
          </div>
        </div>
      </div>
    </Side>
  );
};

export default SuiviPedagogique;
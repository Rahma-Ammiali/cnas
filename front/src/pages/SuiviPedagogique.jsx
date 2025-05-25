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
      <span className={`px-3 py-1 rounded text-white ${
        value === 'Amélioration' ? 'bg-blue-500' :
        value === 'Stagnation' ? 'bg-orange-500' :
        value === 'Régression' ? 'bg-red-500' : 'bg-gray-500'
      }`}>
        {value || 'Non défini'}
      </span>
    );

    return (
      <select
        value={value || ''}
        onChange={(e) => handleChange(e, `statut_${field}`)}
        className="border rounded px-2 py-1"
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
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">{title} :</h3>
          <StatutSelect field={statutField} value={suivi[`statut_${statutField}`]} />
        </div>
        <textarea
          value={suivi[obsField] || ''}
          onChange={(e) => handleChange(e, obsField)}
          disabled={!isEditing}
          className="w-full p-2 border rounded min-h-[100px] bg-[#F0F8FF] focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={isEditing ? "Saisir vos observations..." : "Aucune observation"}
        />
      </div>
    );
  };

  return (
    <Side>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#00428C]">Suivi Psychologique et pédagogique</h2>
          <div className="space-x-4">
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className={`px-4 py-2 rounded ${
                isEditing ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
            >
              {isEditing ? 'Enregistrer' : 'Modifier'}
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-600 text-white"
            >
              Imprimer
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <ObservationSection
            title="Observations par rapport à l'adaptation de l'enfant à la CJE"
            obsField="obs_adaptation"
            statutField="adaptation"
          />
          
          <ObservationSection
            title="Observations par rapport à la relation aux autres enfants (socialisation)"
            obsField="obs_socialisation"
            statutField="socialisation"
          />
          
          <ObservationSection
            title="Observations par rapport à l'acquisition de l'autonomie dans la vie pratique"
            obsField="obs_autonomie"
            statutField="autonomie"
          />
          
          <ObservationSection
            title="Observations par rapport à l'acquisition des enseignements en pré mathématiques"
            obsField="obs_premath"
            statutField="premath"
          />
          
          <ObservationSection
            title="Observations par rapport à l'acquisition des enseignements en pré lecture"
            obsField="obs_prelecture"
            statutField="prelecture"
          />
          
          <ObservationSection
            title="Observations par rapport à l'acquisition des enseignements en pré écriture"
            obsField="obs_preecriture"
            statutField="preecriture"
          />
        </div>
      </div>
    </Side>
  );
};

export default SuiviPedagogique;
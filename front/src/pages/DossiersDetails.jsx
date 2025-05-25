import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Side from '../components/Side';

const DossierDetails = () => {
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
        <div className="p-6">
          <div className="text-center">Chargement...</div>
        </div>
      </Side>
    );
  }

  if (!dossier) {
    return (
      <Side>
        <div className="p-6">
          <div className="text-center">Dossier non trouvé</div>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
          >
            Retour
          </button>
        </div>
      </Side>
    );
  }

  return (
    <Side>
      <div className="p-6 bg-[white]  shadow-xl border border-gray-200 rounded-l h-[90vh] overflow-hidden">
        <div className='h-full overflow-y-auto pr-2'> 
          <div className="flex justify-between items-center mb-4">
            <button 
              onClick={() => navigate(-1)}
              className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded cursor-pointer"
            >
              Retour
            </button>
            <button
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer"
            >
              Imprimer
            </button>
          </div>

          <h2 className='text-3xl text-[#00428C] font-bold mb-6'>Détails du Dossier</h2>

          <div className="grid grid-cols-1 gap-8">
            <div className="bg-white p-6 shadow-l border border-gray-200 rounded-l ">
              <h2 className="text-xl font-semibold mb-4">Information sur l'enfant :</h2>
              <div className="grid grid-cols-1 gap-4 ">
                <div>
                  <label className="font-medium">Nom :</label>
                  <input type="text" value={dossier.nom || ''} readOnly className="ml-2 border rounded px-2 py-1 w-full" />
                </div>
                <div>
                  <label className="font-medium">Prénom :</label>
                  <input type="text" value={dossier.prenom || ''} readOnly className="ml-2 border rounded px-2 py-1 w-full" />
                </div>
                <div>
                  <label className="font-medium">Date de naissance :</label>
                  <input type="text" value={dossier.date_naissance || ''} readOnly className="ml-2 border rounded px-2 py-1 w-full" />
                </div>
                <div>
                  <label className="font-medium">Situation Handicap :</label>
                  <input type="text" value={dossier.handicap === 'Oui' ? dossier.handicap_details || 'Oui' : 'Non'} readOnly className="ml-2 border rounded px-2 py-1 w-full" />
                </div>
                <div>
                  <label className="font-medium">Maladie Chronique :</label>
                  <input type="text" value={dossier.maladie_chronique === 'Oui' ? dossier.maladie_details || 'Oui' : 'Non'} readOnly className="ml-2 border rounded px-2 py-1 w-full" />
                </div>
                <div>
                  <label className="font-medium">Année Scolaire :</label>
                  <input type="text" value={dossier.annee_scolaire || ''} readOnly className="ml-2 border rounded px-2 py-1 w-full" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 shadow-l border border-gray-200 rounded-l">
              <h2 className="text-xl font-semibold mb-4">Informations sur les parents :</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="font-medium">Prénom du père :</label>
                  <input type="text" value={dossier.prenom_pere || ''} readOnly className="ml-2 border rounded px-2 py-1 w-full" />
                </div>
                <div>
                  <label className="font-medium">Nom et Prénom de la mère :</label>
                  <input type="text" value={`${dossier.nom_mere || ''} ${dossier.prenom_mere || ''}`} readOnly className="ml-2 border rounded px-2 py-1 w-full" />
                </div>
                <div>
                  <label className="font-medium">Numéro d'assurance de la mère :</label>
                  <input type="text" value={dossier.assurance_mere_ou_employeur || ''} readOnly className="ml-2 border rounded px-2 py-1 w-full" />
                </div>
                <div>
                  <label className="font-medium">Num tel du père :</label>
                  <input type="text" value={dossier.telephone_pere || ''} readOnly className="ml-2 border rounded px-2 py-1 w-full" />
                </div>
                <div>
                  <label className="font-medium">Num tel de la mère :</label>
                  <input type="text" value={dossier.telephone_mere || ''} readOnly className="ml-2 border rounded px-2 py-1 w-full" />
                </div>
                <div>
                  <label className="font-medium">Adresse :</label>
                  <input type="text" value={dossier.adresse || ''} readOnly className="ml-2 border rounded px-2 py-1 w-full" />
                </div>
                <div>
                  <label className="font-medium">Tarif Préférentiel :</label>
                  <input type="text" value={dossier.tarif_preferentiel || ''} readOnly className="ml-2 border rounded px-2 py-1 w-full" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-2">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow cursor-pointer">
                Pièces jointes
              </button>
              <button
                onClick={() => navigate(`/suivi-pedagogique/${id}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow cursor-pointer"
              >
                Suivi Psychopédagogique
              </button>
            </div>
          </div>
        </div>
      </div>
    </Side>
  );
};

export default DossierDetails;

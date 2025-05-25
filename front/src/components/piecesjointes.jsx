import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiUpload, FiEye, FiCheck, FiArrowLeft, FiPaperclip } from 'react-icons/fi';

const PiecesJointes = () => {
  const { dossierId } = useParams();
  const navigate = useNavigate();
  const [piecesJointes, setPiecesJointes] = useState([
    { id: 1, nom: 'Demande de préinscription' },
    { id: 2, nom: "L'extrait du guide de fonctionnement dument" },
    { id: 3, nom: 'Autorisations parentales relatives' },
    { id: 4, nom: "certificat médical de l'enfant" },
    { id: 5, nom: "Scan du carnet de santé de l'enfant" },
    { id: 6, nom: "Jugement attestant la garde de l'enfant, pour les parents divorcés" },
    { id: 7, nom: "Une kafala pour les enfants adoptés" }
  ]);
  const [documentsStatus, setDocumentsStatus] = useState({});

  useEffect(() => {
    fetchDocuments();
  }, [dossierId]);

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/pieces-jointes/dossier/${dossierId}`);
      const data = await response.json();
      const statusMap = {};
      data.forEach(doc => {
        statusMap[doc.nom_document] = {
          id: doc.id,
          status: doc.statut
        };
      });
      setDocumentsStatus(statusMap);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleUpload = async (nom) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx';
    
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('nom_document', nom);

      try {
        const response = await fetch(`http://localhost:5000/api/pieces-jointes/upload/${dossierId}`, {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          alert('Document ajouté avec succès');
          fetchDocuments();
        } else {
          alert('Erreur lors de l\'ajout du document');
        }
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de l\'ajout du document');
      }
    };

    input.click();
  };

  const handleConsult = async (nom) => {
    try {
      const document = documentsStatus[nom];
      if (document?.id) {
        window.open(`http://localhost:5000/api/pieces-jointes/download/${document.id}`, '_blank');
      } else {
        alert('Document non trouvé');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la consultation du document');
    }
  };

  const handleValidation = async (nom) => {
    const document = documentsStatus[nom];
    if (!document?.id) {
      alert('Aucun document à valider');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/pieces-jointes/valider/${document.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert('Document validé avec succès');
        fetchDocuments();
      } else {
        alert('Erreur lors de la validation du document');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la validation du document');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate(`/dossiers/${dossierId}`)}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-all duration-300 transform hover:scale-105"
          >
            <FiArrowLeft className="mr-2" /> Retour au dossier
          </button>
          <h1 className="text-2xl font-bold text-blue-600 mt-4 flex items-center">
            <FiPaperclip className="mr-3 transition-all duration-500 hover:rotate-12" /> 
            Les pièces jointes :
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-500">
          <div className="grid grid-cols-4 gap-4 p-4 bg-blue-600 text-white font-semibold rounded-t-lg">
            <div>Nom du document</div>
            <div>Ajout</div>
            <div>Voir plus</div>
            <div>Validation</div>
          </div>

          {piecesJointes.map((piece) => (
            <div key={piece.id} className="grid grid-cols-4 gap-4 p-4 border-b items-center hover:bg-blue-50 transition-colors duration-300">
              <div className="text-blue-600 font-medium">{piece.nom}</div>
              
              {/* Bouton Ajouter avec effets accentués */}
              <div>
                <button
                  onClick={() => handleUpload(piece.nom)}
                  className="flex items-center justify-center bg-white text-blue-600 px-4 py-2 rounded-lg border-2 border-blue-200 shadow-md hover:shadow-lg hover:scale-110 active:scale-95 transition-all duration-300"
                >
                  <FiUpload className="mr-2" /> Ajouter
                </button>
              </div>
              
              {/* Bouton Consulter avec effets accentués */}
              <div>
                <button
                  onClick={() => handleConsult(piece.nom)}
                  disabled={!documentsStatus[piece.nom]}
                  className={`flex items-center justify-center px-4 py-2 rounded-lg border-2 shadow-md hover:shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 ${
                    documentsStatus[piece.nom] 
                      ? 'bg-white text-green-600 border-green-200 hover:bg-green-100' 
                      : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  }`}
                >
                  <FiEye className="mr-2" /> Consulter
                </button>
              </div>
              
              {/* Section Validation avec effets */}
              <div>
                {documentsStatus[piece.nom]?.status === 'Validé' ? (
                  <div className="flex items-center text-green-600 font-medium animate-pulse">
                    <FiCheck className="mr-2 text-2xl" /> Validé
                  </div>
                ) : documentsStatus[piece.nom]?.id ? (
                  <button
                    onClick={() => handleValidation(piece.nom)}
                    className="flex items-center justify-center bg-white text-blue-600 px-4 py-2 rounded-lg border-2 border-blue-200 shadow-md hover:shadow-lg hover:scale-110 active:scale-95 transition-all duration-300"
                  >
                    <FiCheck className="mr-2" /> Valider
                  </button>
                ) : (
                  <span className="text-gray-400 italic">En attente</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PiecesJointes;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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
          fetchDocuments(); // Rafraîchir la liste des documents
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
        fetchDocuments(); // Rafraîchir la liste des documents
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
            className="text-blue-600 hover:text-blue-800"
          >
            ← Retour au dossier
          </button>
          <h1 className="text-2xl font-bold text-blue-600 mt-4">Les pieces jointes :</h1>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 font-semibold">
            <div>Nom du document</div>
            <div>Ajout</div>
            <div>Voir plus</div>
            <div>Validation</div>
          </div>

          {piecesJointes.map((piece) => (
            <div key={piece.id} className="grid grid-cols-4 gap-4 p-4 border-b items-center">
              <div className="text-blue-600">{piece.nom}</div>
              <div>
                <button
                  onClick={() => handleUpload(piece.nom)}
                  className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600"
                >
                  Ajouter
                </button>
              </div>
              <div>
                <button
                  onClick={() => handleConsult(piece.nom)}
                  className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                  disabled={!documentsStatus[piece.nom]}
                >
                  Consulter
                </button>
              </div>
              <div>
                {documentsStatus[piece.nom]?.status === 'Validé' ? (
                  <span className="text-green-600 font-medium">✓ Validé</span>
                ) : documentsStatus[piece.nom]?.id ? (
                  <button
                    onClick={() => handleValidation(piece.nom)}
                    className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                  >
                    Valider
                  </button>
                ) : (
                  <span className="text-gray-400">En attente du document</span>
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
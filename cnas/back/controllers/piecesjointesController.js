const db = require('../db');
const fs = require('fs');
const path = require('path');

const piecesJointesController = {
  // Récupérer toutes les pièces jointes d'un enfant
  getPiecesJointesByDossier: (req, res) => {
    const enfantId = req.params.dossierId; // On garde dossierId dans l'URL pour ne pas casser le front
    
    const query = `
      SELECT * 
      FROM pieces_jointes 
      WHERE id_enfant = ?
      ORDER BY date_upload DESC
    `;
    
    db.query(query, [enfantId], (err, results) => {
      if (err) {
        console.error('Erreur lors de la récupération des pièces jointes:', err);
        return res.status(500).json({ error: 'Erreur serveur' });
      }
      res.json(results);
    });
  },

  // Upload d'une nouvelle pièce jointe
  uploadPieceJointe: (req, res) => {
    console.log('Début de l\'upload:', {
      body: req.body,
      file: req.file,
      params: req.params
    });

    const enfantId = req.params.dossierId; // On garde dossierId dans l'URL pour ne pas casser le front
    const { nom_document } = req.body;
    
    if (!req.file) {
      console.error('Aucun fichier fourni');
      return res.status(400).json({ error: 'Aucun fichier fourni' });
    }

    if (!nom_document) {
      console.error('Nom du document manquant');
      return res.status(400).json({ error: 'Nom du document requis' });
    }

    // Vérifier si le dossier existe
    const uploadDir = path.join(__dirname, '..', 'uploads', 'pieces-jointes');
    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
    } catch (err) {
      console.error('Erreur lors de la création du dossier:', err);
      return res.status(500).json({ error: 'Erreur lors de la création du dossier d\'upload' });
    }

    // Créer le chemin du fichier
    const fileName = `${Date.now()}-${req.file.originalname}`;
    const filePath = path.join(uploadDir, fileName);

    // Déplacer le fichier
    try {
      fs.renameSync(req.file.path, filePath);
    } catch (err) {
      console.error('Erreur lors du déplacement du fichier:', err);
      return res.status(500).json({ error: 'Erreur lors du déplacement du fichier' });
    }

    const query = `
      INSERT INTO pieces_jointes 
      (id_enfant, nom_document, nom_fichier, chemin_fichier, type_mime, taille_fichier, statut, date_upload) 
      VALUES (?, ?, ?, ?, ?, ?, 'En attente', NOW())
    `;
    
    const values = [
      enfantId,
      nom_document,
      fileName,
      filePath,
      req.file.mimetype,
      req.file.size
    ];

    console.log('Insertion dans la base de données:', {
      query,
      values
    });

    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Erreur SQL lors de l\'upload:', err);
        // Supprimer le fichier en cas d'erreur
        try {
          fs.unlinkSync(filePath);
        } catch (unlinkErr) {
          console.error('Erreur lors de la suppression du fichier après échec SQL:', unlinkErr);
        }
        return res.status(500).json({ error: 'Erreur lors de l\'upload dans la base de données' });
      }
      
      console.log('Upload réussi:', {
        id: result.insertId,
        fileName,
        filePath
      });

      res.json({ 
        message: 'Fichier uploadé avec succès',
        id: result.insertId 
      });
    });
  },

  // Télécharger une pièce jointe
  telechargerPieceJointe: (req, res) => {
    const id = req.params.id;
    
    db.query('SELECT * FROM pieces_jointes WHERE id = ?', [id], (err, results) => {
      if (err || results.length === 0) {
        console.error('Erreur lors de la récupération de la pièce jointe:', err);
        return res.status(404).json({ error: 'Pièce jointe non trouvée' });
      }
      
      const pieceJointe = results[0];
      const cheminFichier = pieceJointe.chemin_fichier;
      
      if (!fs.existsSync(cheminFichier)) {
        console.error('Fichier non trouvé:', cheminFichier);
        return res.status(404).json({ error: 'Fichier non trouvé sur le serveur' });
      }
      
      res.download(cheminFichier, pieceJointe.nom_fichier);
    });
  },

  // Valider une pièce jointe
  validerPieceJointe: (req, res) => {
    const id = req.params.id;
    
    const query = `
      UPDATE pieces_jointes 
      SET statut = 'Validé'
      WHERE id = ?
    `;
    
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error('Erreur lors de la validation de la pièce jointe:', err);
        return res.status(500).json({ error: 'Erreur serveur' });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Pièce jointe non trouvée' });
      }
      
      res.json({ message: 'Pièce jointe validée avec succès' });
    });
  }
};

module.exports = piecesJointesController;
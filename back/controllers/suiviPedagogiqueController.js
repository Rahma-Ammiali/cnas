const db = require('../db');

const suiviPedagogiqueController = {
  // Récupérer le suivi pédagogique d'un enfant
  getSuiviPedagogique: (req, res) => {
    const enfantId = req.params.id;
    
    const query = `
      SELECT * 
      FROM suivi_pedagogique 
      WHERE id_enfant = ?
      ORDER BY date_observation DESC
      LIMIT 1
    `;
    
    db.query(query, [enfantId], (err, results) => {
      if (err) {
        console.error('Erreur lors de la récupération du suivi:', err);
        return res.status(500).json({ error: 'Erreur serveur' });
      }
      res.json(results[0] || {});
    });
  },

  // Mettre à jour ou créer un suivi pédagogique
  updateSuiviPedagogique: (req, res) => {
    const enfantId = req.params.id;
    const {
      obs_adaptation,
      statut_adaptation,
      obs_socialisation,
      statut_socialisation,
      obs_autonomie,
      statut_autonomie,
      obs_premath,
      statut_premath,
      obs_prelecture,
      statut_prelecture,
      obs_preecriture,
      statut_preecriture,
      evenements_places,
      date_observation
    } = req.body;

    // Vérifier si un suivi existe déjà
    const checkQuery = 'SELECT id FROM suivi_pedagogique WHERE id_enfant = ?';
    
    db.query(checkQuery, [enfantId], (err, results) => {
      if (err) {
        console.error('Erreur lors de la vérification:', err);
        return res.status(500).json({ error: 'Erreur serveur' });
      }

      if (results.length > 0) {
        // Mise à jour
        const updateQuery = `
          UPDATE suivi_pedagogique 
          SET 
            obs_adaptation = ?,
            statut_adaptation = ?,
            obs_socialisation = ?,
            statut_socialisation = ?,
            obs_autonomie = ?,
            statut_autonomie = ?,
            obs_premath = ?,
            statut_premath = ?,
            obs_prelecture = ?,
            statut_prelecture = ?,
            obs_preecriture = ?,
            statut_preecriture = ?,
            evenements_places = ?,
            date_observation = ?,
            statut_validation = 'En attente'
          WHERE id_enfant = ?
        `;

        const updateValues = [
          obs_adaptation,
          statut_adaptation,
          obs_socialisation,
          statut_socialisation,
          obs_autonomie,
          statut_autonomie,
          obs_premath,
          statut_premath,
          obs_prelecture,
          statut_prelecture,
          obs_preecriture,
          statut_preecriture,
          evenements_places,
          date_observation,
          enfantId
        ];

        db.query(updateQuery, updateValues, (updateErr) => {
          if (updateErr) {
            console.error('Erreur lors de la mise à jour:', updateErr);
            return res.status(500).json({ error: 'Erreur lors de la mise à jour' });
          }
          res.json({ message: 'Suivi pédagogique mis à jour avec succès' });
        });
      } else {
        // Création
        const insertQuery = `
          INSERT INTO suivi_pedagogique (
            id_enfant,
            obs_adaptation,
            statut_adaptation,
            obs_socialisation,
            statut_socialisation,
            obs_autonomie,
            statut_autonomie,
            obs_premath,
            statut_premath,
            obs_prelecture,
            statut_prelecture,
            obs_preecriture,
            statut_preecriture,
            evenements_places,
            date_observation,
            statut_validation
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'En attente')
        `;

        const insertValues = [
          enfantId,
          obs_adaptation,
          statut_adaptation,
          obs_socialisation,
          statut_socialisation,
          obs_autonomie,
          statut_autonomie,
          obs_premath,
          statut_premath,
          obs_prelecture,
          statut_prelecture,
          obs_preecriture,
          statut_preecriture,
          evenements_places,
          date_observation
        ];

        db.query(insertQuery, insertValues, (insertErr) => {
          if (insertErr) {
            console.error('Erreur lors de la création:', insertErr);
            return res.status(500).json({ error: 'Erreur lors de la création' });
          }
          res.json({ message: 'Suivi pédagogique créé avec succès' });
        });
      }
    });
  },

  // Valider un suivi pédagogique
  validerSuiviPedagogique: (req, res) => {
    const enfantId = req.params.id;
    
    const query = `
      UPDATE suivi_pedagogique 
      SET statut_validation = 'Validé'
      WHERE id_enfant = ?
    `;
    
    db.query(query, [enfantId], (err, result) => {
      if (err) {
        console.error('Erreur lors de la validation du suivi:', err);
        return res.status(500).json({ error: 'Erreur serveur' });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Suivi pédagogique non trouvé' });
      }
      
      res.json({ message: 'Suivi pédagogique validé avec succès' });
    });
  }
};

module.exports = suiviPedagogiqueController; 
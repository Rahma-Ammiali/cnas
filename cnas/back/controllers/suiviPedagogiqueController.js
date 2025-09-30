const db = require('../db');

const suiviPedagogiqueController = {
  // Récupérer le suivi pédagogique d'un enfant
  getSuiviPedagogique: (req, res) => {
    const enfantId = req.params.id_enfant;
    console.log('Récupération suivi pour enfant:', enfantId);
    
    if (!enfantId) {
      return res.status(400).json({ error: 'ID enfant manquant' });
    }

    const query = `
      SELECT * 
      FROM suivi_pedagogique 
      WHERE id_enfant = ?
      ORDER BY date_observation DESC
      LIMIT 1
    `;
    
    db.query(query, [enfantId], (error, results) => {
      if (error) {
        console.error('Erreur lors de la récupération:', error);
        return res.status(500).json({ error: 'Erreur lors de la récupération des données' });
      }
      
      // Si aucun résultat, renvoyer un objet vide avec l'id_enfant
      res.json(results[0] || {
        id_enfant: enfantId,
        obs_adaptation: '',
        statut_adaptation: null,
        obs_socialisation: '',
        statut_socialisation: null,
        obs_autonomie: '',
        statut_autonomie: null,
        obs_premath: '',
        statut_premath: null,
        obs_prelecture: '',
        statut_prelecture: null,
        obs_preecriture: '',
        statut_preecriture: null,
        evenements_places: '',
        date_observation: new Date().toISOString().split('T')[0],
        statut_validation: 'En attente'
      });
    });
  },

  // Mettre à jour ou créer un suivi pédagogique
  updateSuiviPedagogique: (req, res) => {
    const enfantId = req.params.id_enfant;
    console.log('Mise à jour suivi pour enfant:', enfantId);
    console.log('Données reçues:', req.body);

    if (!enfantId) {
      return res.status(400).json({ error: 'ID enfant manquant' });
    }

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

    // Vérifier si un suivi existe déjà et récupérer son statut de validation
    db.query(
      'SELECT id, statut_validation FROM suivi_pedagogique WHERE id_enfant = ?',
      [enfantId],
      (error, results) => {
        if (error) {
          console.error('Erreur lors de la vérification:', error);
          return res.status(500).json({ error: 'Erreur lors de la vérification' });
        }

        const values = [
          obs_adaptation || '',
          statut_adaptation || null,
          obs_socialisation || '',
          statut_socialisation || null,
          obs_autonomie || '',
          statut_autonomie || null,
          obs_premath || '',
          statut_premath || null,
          obs_prelecture || '',
          statut_prelecture || null,
          obs_preecriture || '',
          statut_preecriture || null,
          evenements_places || '',
          date_observation || new Date().toISOString().split('T')[0]
        ];

        if (results.length > 0) {
          // Mise à jour en réinitialisant le statut de validation
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

          db.query(updateQuery, [...values, enfantId], (error) => {
            if (error) {
              console.error('Erreur lors de la mise à jour:', error);
              return res.status(500).json({ error: 'Erreur lors de la mise à jour' });
            }
            res.json({ 
              message: 'Suivi pédagogique mis à jour avec succès',
              statut_validation: 'En attente'
            });
          });
        } else {
          // Création avec statut de validation initial
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

          db.query(insertQuery, [enfantId, ...values], (error) => {
            if (error) {
              console.error('Erreur lors de la création:', error);
              return res.status(500).json({ error: 'Erreur lors de la création' });
            }
            res.json({ 
              message: 'Suivi pédagogique créé avec succès',
              statut_validation: 'En attente'
            });
          });
        }
      }
    );
  },

  // Valider un suivi pédagogique
  validerSuiviPedagogique: (req, res) => {
    const enfantId = req.params.id_enfant;
    console.log('Validation suivi pour enfant:', enfantId);

    if (!enfantId) {
      return res.status(400).json({ error: 'ID enfant manquant' });
    }

    db.query(
      'UPDATE suivi_pedagogique SET statut_validation = ? WHERE id_enfant = ?',
      ['Validé', enfantId],
      (error, result) => {
        if (error) {
          console.error('Erreur lors de la validation:', error);
          return res.status(500).json({ error: 'Erreur lors de la validation' });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Suivi pédagogique non trouvé' });
        }

        res.json({ message: 'Suivi pédagogique validé avec succès' });
      }
    );
  }
};

module.exports = suiviPedagogiqueController; 
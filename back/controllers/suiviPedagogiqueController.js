const db = require('../db');

// Récupérer le suivi pédagogique d'un enfant
const getSuiviPedagogique = (req, res) => {
    const { id_enfant } = req.params;
    const sql = `
        SELECT * FROM suivi_pedagogique 
        WHERE id_enfant = ?
        ORDER BY date_observation DESC
        LIMIT 1
    `;
    
    db.query(sql, [id_enfant], (err, results) => {
        if (err) {
            console.error('Erreur SQL:', err);
            return res.status(500).json({ error: "erreur serveur" });
        }
        res.json(results[0] || {
            id_enfant,
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
            statut_preecriture: null,
            date_observation: new Date()
        });
    });
};

// Mettre à jour ou créer un suivi pédagogique
const updateSuiviPedagogique = (req, res) => {
    const { id_enfant } = req.params;
    const {
        obs_adaptation,
        obs_socialisation,
        obs_autonomie,
        obs_premath,
        obs_prelecture,
        obs_preecriture,
        statut_adaptation,
        statut_socialisation,
        statut_autonomie,
        statut_premath,
        statut_prelecture,
        statut_preecriture
    } = req.body;

    const sql = `
        INSERT INTO suivi_pedagogique (
            id_enfant,
            obs_adaptation,
            obs_socialisation,
            obs_autonomie,
            obs_premath,
            obs_prelecture,
            obs_preecriture,
            statut_adaptation,
            statut_socialisation,
            statut_autonomie,
            statut_premath,
            statut_prelecture,
            statut_preecriture,
            date_observation
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const values = [
        id_enfant,
        obs_adaptation,
        obs_socialisation,
        obs_autonomie,
        obs_premath,
        obs_prelecture,
        obs_preecriture,
        statut_adaptation,
        statut_socialisation,
        statut_autonomie,
        statut_premath,
        statut_prelecture,
        statut_preecriture
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Erreur SQL:', err);
            return res.status(500).json({ error: "erreur serveur" });
        }
        res.json({ message: "Suivi pédagogique enregistré avec succès", id: result.insertId });
    });
};

module.exports = {
    getSuiviPedagogique,
    updateSuiviPedagogique
}; 
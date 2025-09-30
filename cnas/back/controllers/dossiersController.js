const db = require('../db')

const recupererEnfantsValides = (req,res)=>{
    const { section } = req.query;
    
    let sql = `
    SELECT DISTINCT
        e.id,
        e.nom,
        e.prenom,
        e.date_naissance,
        e.sexe,
        CASE 
            WHEN TIMESTAMPDIFF(YEAR, e.date_naissance, CURDATE()) = 3 THEN 'Petite Section'
            WHEN TIMESTAMPDIFF(YEAR, e.date_naissance, CURDATE()) = 4 THEN 'Moyenne Section'
            WHEN TIMESTAMPDIFF(YEAR, e.date_naissance, CURDATE()) = 5 THEN 'Grande Section'
            ELSE NULL
        END as classe,
        p.valide,
        p.date_depot
    FROM enfants e
    INNER JOIN (
        SELECT p1.*
        FROM preinscriptions p1
        INNER JOIN (
            SELECT id_enfant, MAX(date_depot) as last_depot
            FROM preinscriptions
            WHERE valide = 1
            GROUP BY id_enfant
        ) p2 ON p1.id_enfant = p2.id_enfant AND p1.date_depot = p2.last_depot
        WHERE p1.valide = 1
    ) p ON e.id = p.id_enfant
    WHERE e.date_sortie IS NULL`;

    const queryParams = [];

    if (section && section !== 'Tous') {
        sql += ` AND (
            CASE 
                WHEN TIMESTAMPDIFF(YEAR, e.date_naissance, CURDATE()) = 3 THEN 'Petite Section'
                WHEN TIMESTAMPDIFF(YEAR, e.date_naissance, CURDATE()) = 4 THEN 'Moyenne Section'
                WHEN TIMESTAMPDIFF(YEAR, e.date_naissance, CURDATE()) = 5 THEN 'Grande Section'
                ELSE NULL
            END
        ) = ?`;
        queryParams.push(section);
    }

    sql += ` ORDER BY e.nom, e.prenom`;
    
    db.query(sql, queryParams, (err,results)=>{
        if(err) {
            console.error('Erreur SQL:', err);
            return res.status(500).json({error:"erreur serveur"})
        }
        res.json(results)
    })
}

const getDossierById = (req,res)=>{
    const {id} = req.params;
    const sql = `
    SELECT 
        e.id,
        e.nom,
        e.prenom,
        e.date_naissance,
        e.date_sortie,
        e.sexe,
        CASE 
            WHEN TIMESTAMPDIFF(YEAR, e.date_naissance, CURDATE()) = 3 THEN 'Petite Section'
            WHEN TIMESTAMPDIFF(YEAR, e.date_naissance, CURDATE()) = 4 THEN 'Moyenne Section'
            WHEN TIMESTAMPDIFF(YEAR, e.date_naissance, CURDATE()) = 5 THEN 'Grande Section'
        END as classe,
        p.handicap,
        p.handicap_details,
        p.maladie_chronique,
        p.maladie_details,
        p.assurance_mere_ou_employeur,
        p.tarif_preferentiel,
        p.annee_scolaire,
        p.adresse,
        p.date_depot,
        pere.nom AS nom_pere,
        pere.prenom AS prenom_pere,
        pere.telephone AS telephone_pere,
        mere.nom AS nom_mere,
        mere.prenom AS prenom_mere,
        mere.telephone AS telephone_mere
    FROM enfants e
    INNER JOIN preinscriptions p ON e.id = p.id_enfant
    LEFT JOIN parents pere ON e.id_pere = pere.id
    LEFT JOIN parents mere ON e.id_mere = mere.id
    WHERE e.id = ? AND p.valide = 1
    ORDER BY p.date_depot DESC`;

    db.query(sql,[id],(err,results)=>{
        if(err) {
            console.error('Erreur SQL:', err);
            return res.status(500).json({error:"erreur serveur"});
        }
        if(results.length === 0) return res.status(404).json({error:"dossier non trouvé"});
        res.json(results[0]);
    })
}

// Nouveau: marquer un enfant comme sorti
const setDateSortie = (req, res) => {
    const { id } = req.params; // enfant id
    const { date_sortie, raison } = req.body; // 'YYYY-MM-DD'
    if (!date_sortie) return res.status(400).json({ error: 'date_sortie requise' });
    db.query('UPDATE enfants SET date_sortie = ? WHERE id = ?', [date_sortie, id], (err, result) => {
        if (err) {
            console.error('Erreur SQL setDateSortie:', err);
            return res.status(500).json({ error: 'erreur serveur' });
        }
        // log history with optional reason
        db.query('INSERT INTO historique_enfant (id_enfant, type, date_evenement, details) VALUES (?, "sortie", ?, ?)', [id, date_sortie, raison || null], () => {});
        res.json({ success: true });
    });
}

// Nouveau: lister enfants sortis
const listerEnfantsSortis = (req, res) => {
    const sql = `
      SELECT e.id, e.nom, e.prenom, e.date_naissance, e.sexe, e.date_sortie,
             p.classe, p.date_depot
      FROM enfants e
      LEFT JOIN (
        SELECT p1.*
        FROM preinscriptions p1
        INNER JOIN (
            SELECT id_enfant, MAX(date_depot) as last_depot
            FROM preinscriptions
            GROUP BY id_enfant
        ) p2 ON p1.id_enfant = p2.id_enfant AND p1.date_depot = p2.last_depot
      ) p ON e.id = p.id_enfant
      WHERE e.date_sortie IS NOT NULL
      ORDER BY e.date_sortie DESC, e.nom, e.prenom`;
    db.query(sql, [], (err, rows) => {
        if (err) {
            console.error('Erreur SQL listerEnfantsSortis:', err);
            return res.status(500).json({ error: 'erreur serveur' });
        }
        res.json(rows);
    });
}

// Nouveau: réinscrire (annuler la sortie)
const reinscrireEnfant = (req, res) => {
    const { id } = req.params; // enfant id
    const { date_reinscription } = req.body || {};
    db.query('UPDATE enfants SET date_sortie = NULL WHERE id = ?', [id], (err) => {
        if (err) {
            console.error('Erreur SQL reinscrireEnfant:', err);
            return res.status(500).json({ error: 'erreur serveur' });
        }
        // log history with provided date or today
        const d = (date_reinscription && /^\d{4}-\d{2}-\d{2}$/.test(date_reinscription))
          ? date_reinscription
          : new Date().toISOString().slice(0,10);
        db.query('INSERT INTO historique_enfant (id_enfant, type, date_evenement, details) VALUES (?, "reinscription", ?, NULL)', [id, d], () => {});
        res.json({ success: true });
    });
}

// Nouveau: récupérer l'historique d'un enfant
const getHistorique = (req, res) => {
    const { id } = req.params; // enfant id
    const sql = `
      SELECT type, date_evenement, details
      FROM historique_enfant
      WHERE id_enfant = ?
      ORDER BY date_evenement DESC, id DESC
    `;
    db.query(sql, [id], (err, rows) => {
        if (err) {
            console.error('Erreur SQL getHistorique:', err);
            return res.status(500).json({ error: 'erreur serveur' });
        }
        res.json(rows);
    });
}

// Alias pour la compatibilité avec le frontend
const getDossiersById = getDossierById;

module.exports = {
    recupererEnfantsValides,
    getDossierById,
    getDossiersById,
    setDateSortie,
    listerEnfantsSortis,
    reinscrireEnfant,
    getHistorique
};
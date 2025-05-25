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
        p.classe,
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
    ) p ON e.id = p.id_enfant`;

    if (section && section !== 'Tous') {
        sql += ` AND p.classe = ?`;
    }

    sql += ` ORDER BY e.nom, e.prenom`;

    const queryParams = section && section !== 'Tous' ? [section] : [];
    
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

// Alias pour la compatibilité avec le frontend
const getDossiersById = getDossierById;

module.exports = {
    recupererEnfantsValides,
    getDossierById,
    getDossiersById
};
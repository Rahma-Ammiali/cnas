const db = require('../db')

const recupererEnfantsValides = (req,res)=>{
    const { section } = req.query; // Récupérer la section depuis les paramètres de requête
    
    let sectionCondition = '';
    if (section) {
        if (section === 'Petite Section') {
            sectionCondition = 'AND TIMESTAMPDIFF(YEAR, e.date_naissance, CURDATE()) <= 3';
        } else if (section === 'Moyenne Section') {
            sectionCondition = 'AND TIMESTAMPDIFF(YEAR, e.date_naissance, CURDATE()) = 4';
        } else if (section === 'Grande Section') {
            sectionCondition = 'AND TIMESTAMPDIFF(YEAR, e.date_naissance, CURDATE()) >= 5';
        }
    }

    const sql = `
    SELECT 
        e.id,
        e.nom,
        e.prenom,
        e.date_naissance,
        e.sexe,
        CASE 
            WHEN TIMESTAMPDIFF(YEAR, e.date_naissance, CURDATE()) <= 3 THEN 'Petite Section'
            WHEN TIMESTAMPDIFF(YEAR, e.date_naissance, CURDATE()) = 4 THEN 'Moyenne Section'
            ELSE 'Grande Section'
        END as classe,
        p.valide,
        p.date_depot
    FROM enfants e
    INNER JOIN preinscriptions p ON e.id = p.id_enfant
    WHERE p.valide = 1 ${sectionCondition}
    ORDER BY e.nom, e.prenom, p.date_depot DESC`;
    
    db.query(sql,(err,results)=>{
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
            WHEN TIMESTAMPDIFF(YEAR, e.date_naissance, CURDATE()) <= 3 THEN 'Petite Section'
            WHEN TIMESTAMPDIFF(YEAR, e.date_naissance, CURDATE()) = 4 THEN 'Moyenne Section'
            ELSE 'Grande Section'
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
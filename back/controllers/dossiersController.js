const db = require('../db'
)
const recupererEnfantsValides = (req,res)=>{
    const sql=`
    SELECT DISTINCT
    enf.id,
    enf.nom,
    enf.prenom,
    enf.date_naissance,
    enf.sexe,
    pre.classe,
    pre.valide
    FROM enfants enf
    LEFT JOIN (
        SELECT p.*
        FROM preinscriptions p
        WHERE p.valide = 1
        OR p.id IN (
            SELECT MAX(id)
            FROM preinscriptions
            GROUP BY id_enfant
        )
    ) pre ON pre.id_enfant = enf.id
    WHERE pre.valide = 1
    ORDER BY enf.nom, enf.prenom`;
    
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
    const sql =`
    SELECT 
      enf.id,
      enf.nom,
      enf.prenom,
      enf.date_naissance,
      enf.sexe,
      pre.classe,
      pre.handicap,
      pre.handicap_details,
      pre.maladie_chronique,
      pre.maladie_details,
      pre.assurance_mere_ou_employeur,
      pre.tarif_preferentiel,
      pre.annee_scolaire,
      pre.adresse,
      pere.nom AS nom_pere,
      pere.prenom AS prenom_pere,
      pere.telephone AS telephone_pere,
      mere.nom AS nom_mere,
      mere.prenom AS prenom_mere,
      mere.telephone AS telephone_mere
    FROM enfants enf
    LEFT JOIN preinscriptions pre ON pre.id_enfant = enf.id
    LEFT JOIN parents pere ON enf.id_pere = pere.id
    LEFT JOIN parents mere ON enf.id_mere = mere.id
    WHERE enf.id = ?
    ORDER BY pre.date_depot DESC
    LIMIT 1;
    `;
    db.query(sql,[id],(err,results)=>{
        if(err) {
            console.error('Erreur SQL:', err);
            return res.status(500).json({error:"erreur serveur"});
        }
        if(results.length === 0) return res.status(404).json({error:"dossier non trouvé"});
        res.json(results[0]); // On renvoie le premier résultat seulement
    })
}

// Alias pour la compatibilité avec le frontend
const getDossiersById = getDossierById;

module.exports={
    recupererEnfantsValides,
    getDossierById,
    getDossiersById
}
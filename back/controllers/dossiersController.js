const db = require('../db'
)
const recupererEnfantsValides = (req,res)=>{
    const sql=`
    SELECT
    enf.id,
    enf.nom ,
    enf.prenom  , 
    enf.date_naissance,
    enf.sexe,
    pre.classe
    FROM preinscriptions pre 
    JOIN enfants enf ON pre.id_enfant = enf.id
    WHERE pre.valide= 1`;
    db.query(sql,(err,results)=>{
        if(err) return res.status(500).json({error:"erreur serveur"})
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
      pere.nom AS nom_pere,
      pere.prenom AS prenom_pere,
      pere.telephone AS telephone_pere,
      mere.nom AS nom_mere,
      mere.prenom AS prenom_mere,
      mere.telephone AS telephone_mere
    FROM preinscriptions pre
    JOIN enfants enf ON pre.id_enfant = enf.id
    LEFT JOIN parents pere ON enf.id_parent_pere = pere.id
    LEFT JOIN parents mere ON enf.id_parent_mere = mere.id
    WHERE enf.id = ?;
    `;
    db.query(sql,[id],(err,results)=>{
        if(err) return res.status(500).json({error:"erreur serveur"});
        if(results.length ===0 ) return res.status(404).json({error:"dossiers non trouvé"});
        res.json(results[0])
    })
}

module.exports={
    recupererEnfantsValides,
    getDossierById
}
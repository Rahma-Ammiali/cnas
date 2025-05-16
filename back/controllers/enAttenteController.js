const db = require("../db")

const recupererInfos = (req,res) =>{
    const {id} = req.params;
    const sql = `
    SELECT 
    pre.assurance_mere_ou_employeur , 
    pre.tarif_preferentiel,
    pre.handicap,
    pre.handicap_details,
    pre.maladie_chronique,
    pre.maladie_details,
    pre.correspondant,
    pre.date_depot,
    pre.classe,
    
    enf.nom AS nom_enfant,
    enf.prenom AS prenom_enfant , 
    enf.date_naissance,

    mere.nom AS nom_mere,
    mere.prenom AS prenom_mere , 
    mere.num_assurance AS num_assurance_mere , 
    mere.telephone AS telephone_mere , 
    mere.secteur_activite AS secteur_activite_mere,

    pere.nom AS nom_pere,
    pere.prenom AS prenom_pere , 
    pere.num_assurance AS num_assurance_pere , 
    pere.telephone AS telephone_pere , 
    pere.secteur_activite AS secteur_activite_pere

    FROM preinscriptions pre 
    JOIN enfants enf ON pre.id_enfant = enf.id
    LEFT JOIN parents mere ON enf.id_mere  = mere.id
    LEFT JOIN parents pere ON enf.id_pere = pere.id
    WHERE pre.id = ? 
    `;
    db.query(sql,[id],(err,results)=>{
        if(err){
            console.error('erreur sql ',err);
            return res.status(500).json({error:'erreur serveur'})
        }
        if(results.length === 0){
            return res.status(404).json({error:'preinscription non trouvée'})
        }
        res.json(results[0])
    })

}
module.exports={recupererInfos}
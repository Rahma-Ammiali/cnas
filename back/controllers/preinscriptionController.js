const db=require("../db");

const enregistrerInfosPreinscription = (req,res)=>{
    const {
    assurance_mere_ou_employeur,
    tarif_preferentiel,
    tel_pere,
    tel_mere,
    adresse,
    annee_scolaire,
    handicap,
    handicap_details,
    maladie_chronique,
    maladie_details,
    correspondant,
    date_depot,
    enfantSelectionne
    } = req.body;
    const sql = `INSERT INTO preinscriptions
    (assurance_mere_ou_employeur,tarif_preferentiel,tel_pere,tel_mere,adresse,
    annee_scolaire,handicap,handicap_details,maladie_chronique,maladie_details,correspondant,
    date_depot,id_enfant)
    VALUES (? , ? , ? , ? , ? , ? ,? , ? , ? , ? , ? , ? , ?) `
    db.query(sql , [
        assurance_mere_ou_employeur,
        tarif_preferentiel,
        tel_pere,
        tel_mere,
        adresse,
        annee_scolaire,
        handicap,
        handicap_details && handicap === "oui" ? handicap_details:null,
        maladie_chronique,
        maladie_details && maladie_chronique === "oui" ? maladie_details:null,
        correspondant || null,
        date_depot,
        enfantSelectionne.id
    ], (err,result) =>{
        if(err){
            console.error("erreur mySQL : ",err);
            return res.status(500).json({error:"erreur lors de l'enregistrement"})
        }
        res.status(200).json({message:"preinscription enregistrée avec succés"})
    })
}
module.exports = {enregistrerInfosPreinscription};
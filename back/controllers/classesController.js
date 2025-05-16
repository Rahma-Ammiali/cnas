const db = require("../db")

const ajouterCapaciteClasses = (req,res)=>{
    const {
        nom_classe="",
        nbr_places="",
        annee_scolaire=""
    }=req.body
    const sql = `INSERT INTO classes (nom_classe,nbr_places,annee_scolaire) VALUES (?,?,?)`
    db.query(sql,[nom_classe,nbr_places,annee_scolaire],(err,result)=>{
        if(err){
            console.error("erreur mySQL : ",err)
            return res.status(500).json({error:"erreur lors de l'enregistrement "})
        }
        return res.status(200).json({message:"capacité enregistrée avec succées"})
    })
}
module.exports={ajouterCapaciteClasses}
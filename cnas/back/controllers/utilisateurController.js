const db = require('../db')

const ajouterUtilisateur = (req,res)=>{
    const {nom,numAgent,role,password} = req.body;

    const sql= `INSERT INTO utilisateurs (nom,num_agent,role,password) 
    VALUES (?,?,?,?)`;

    db.query(sql,[nom,numAgent,role,password],(err,result) =>{
        if(err) {
            console.error("erreur lors de l'ajout de l'utilisateur : ",err)
            return res.status(500).json({message:"errer serveur"});
        }
        res.status(200).json({message:"utilisateur ajouté avec succés"})
    })
}
module.exports = {ajouterUtilisateur}
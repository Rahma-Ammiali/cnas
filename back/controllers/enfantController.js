const db = require("../db");

const getChildrenByParent = (req,res)=>{
    const numAssurance = req.params.numAssurance;
    const query =`
    SELECT e.id, e.nom , e.prenom , e.date_naissance 
    FROM enfants e 
    JOIN parents p ON e.id_pere = p.id
    JOIN parents p2 ON e.id_mere = p2.id
    WHERE p.num_assurance = ? OR p2.num_assurance = ? 
    AND TIMESTAMPDIFF(YEAR, e.date_naissance, CURDATE()) < 6` ;
    db.query (query , [numAssurance,numAssurance], (err,result) =>{
        if(err){
            return res.status().json({error : "erreur serveur"});

        }
        if(result.length === 0) {
            return res.status(404).json({message:"aucun enfant trouvé pour ce numéro d'assurance "})
        }
        res.status(200).json(result);
    });
};
module.exports={getChildrenByParent}
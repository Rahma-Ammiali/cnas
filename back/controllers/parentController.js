const db = require("../db")
const getParentByChild = (req,res) => {
    const enfantId = req.params.enfantId;
    const query = `SELECT 
    p.nom AS nom_pere , p.prenom AS prenom_pere , p.secteur_activite AS secteur_activite_pere ,
    p1.nom AS nom_mere , p1.prenom AS prenom_mere , p1.secteur_activite AS secteur_activite_mere 
    FROM enfants e
    JOIN parents p ON e.id_pere = p.id 
    JOIN parents p1 ON e.id_mere = p1.id 
    WHERE e.id = ?`;
    
    db.query(query, [enfantId] , (err,result) =>{
        if(err){
            res.status(500).json({error : "Erreur serveur"});
        } else if (result.length === 0 ){
            res.status(404).json({message:"parent non trouvé"});
        }else {
            res.status(200).json(result[0]);
        }
    });
};
module.exports={getParentByChild} 
const db=require("../db");

const enregistrerInfosPreinscription = (req,res)=>{
    function getClasseFromDateNaissance(date_naissance){
        try{
            const birthDate = new Date(date_naissance);
            if (isNaN(birthDate.getTime())){
                console.error("date de naissance invalide :",date_naissance);
                return null;
            }
            const adjustedDate = new Date(
                birthDate.getUTCFullYear(),
                birthDate.getUTCMonth(),
                birthDate.getUTCDate()
            )
            const today = new Date();
            let age = today.getFullYear() - adjustedDate.getFullYear();
            const monthDiff= today.getMonth()-adjustedDate.getMonth();
            if(monthDiff <0 || (monthDiff === 0 && today.getDate() <adjustedDate.getDate())){
                age--;
            }
            console.log("age calculé ",age);
            if (age === 3) return 'Petite section';
            if (age === 4) return 'Moyenne section';
            if (age === 5) return'Grande section';
            return null ;
        }catch (error){
            console.error("erreur dans le calcul de la classe ",error);
            return null ;
        }
    };
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
    enfantSelectionne,
    } = req.body;
    const {date_naissance} = enfantSelectionne;
    const classe = getClasseFromDateNaissance(date_naissance)
    if (!classe){
        console.log("l'enfant ne peux pas etre inscrit")
        return res.status(400).json({error:"classe introuvable pour cet age <"})
    }
    const sql = `INSERT INTO preinscriptions
    (assurance_mere_ou_employeur,tarif_preferentiel,tel_pere,tel_mere,adresse,
    annee_scolaire,handicap,handicap_details,maladie_chronique,maladie_details,correspondant,
    date_depot,id_enfant,classe,valide)
    VALUES (? , ? , ? , ? , ? , ? ,? , ? , ? , ? , ? , ? , ?,? , false) `
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
        enfantSelectionne.id,
        classe
    ], (err,result) =>{
        if(err){
            console.error("erreur mySQL : ",err);
            return res.status(500).json({error:"erreur lors de l'enregistrement"})
        }
        res.status(200).json({message:"preinscription enregistrée avec succés"})
    })
}

// Liste des preinscriptions non validées : 
const getPreinscriptionNonValidees = (req,res)=>{
    const sql = `
    SELECT DISTINCT 
        p.id AS id_preinscription,
        e.nom,
        e.prenom,
        e.date_naissance,
        p.classe
    FROM enfants e
    INNER JOIN (
        SELECT p1.*
        FROM preinscriptions p1
        INNER JOIN (
            SELECT id_enfant, MAX(date_depot) as last_depot
            FROM preinscriptions
            WHERE valide = 0
            GROUP BY id_enfant
        ) p2 ON p1.id_enfant = p2.id_enfant AND p1.date_depot = p2.last_depot
        WHERE p1.valide = 0
    ) p ON e.id = p.id_enfant
    ORDER BY e.nom, e.prenom`;

    db.query(sql,(err1,results) =>{
        if(err1){
            console.error("erreur lors de la recuperation :", err1);
            return res.status(500).json({error:"erreur serveur"})
        }
        res.status(200).json(results)
    })
}
//valider une preinscription : 
const validerPreinscription = (req,res) =>{
    const {id_preinscription, classe} = req.body; 
    
    // D'abord, vérifier les places disponibles
    const checksql = `
    SELECT nbr_places
    FROM classes
    WHERE nom_classe = ?`;
    
    db.query(checksql, [classe], (err, results) => {
        if(err) return res.status(500).json({error:"erreur serveur"});
        if(results.length === 0) return res.status(400).json({error:"classe introuvable"});
        
        const nbr_places = results[0].nbr_places;
        if (nbr_places <= 0) {
            return res.json({
                status: "saturee",
                place_restantes: 0
            });
        }

        // Valider directement la préinscription
        const validatePreinscription = `
        UPDATE preinscriptions 
        SET valide = TRUE
        WHERE id = ?`;

        db.query(validatePreinscription, [id_preinscription], (err2) => {
            if(err2) return res.status(500).json({error:"erreur lors de la validation"});

            // Mettre à jour le nombre de places dans la classe
            const updateClasse = `
            UPDATE classes 
            SET nbr_places = nbr_places - 1 
            WHERE nom_classe = ?`;

            db.query(updateClasse, [classe], (err3) => {
                if(err3) return res.status(500).json({error:"erreur lors de la mise à jour des places"});
                
                res.json({
                    status: "validee",
                    place_restantes: nbr_places - 1
                });
            });
        });
    });
}
const getPlacesRestantes =(req,res) =>{
    const sql = `SELECT nom_classe , nbr_places FROM classes`;
    db.query(sql,(err,results)=>{
        if(err){
            console.error("erreur recuperation des places restantes ",err)
            return res.status(500).json({error:"erreur serveur"})
        }
        res.status(200).json(results);
    })
}
module.exports = {
    enregistrerInfosPreinscription,
    getPreinscriptionNonValidees,
    validerPreinscription,
    getPlacesRestantes
};
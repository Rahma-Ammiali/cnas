const db = require('../db')

const saveEvent = (req,res) =>{
    console.log("donnees recues du front : ",req.body)
    const {
        title,
        date,
    }=req.body;
    if(!title || !date){
        return res.status(400).json({error:"champs manquants"})
    }
    const backgroundColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    const sql = `INSERT INTO evenements 
    (titre , couleur , date) VALUES (?,?,?)`
    db.query(sql,[title,backgroundColor,date],(err,result) =>{
        if(err){
            console.error("erreur mySQL :",err);
            return res.status(500).json({error:"erreur lors de l'enregistrement"})
        }
        res.status(200).json({message:"evenement enregistré avec succés"})
    })
}

const getEvent = (req,res)=>{
    const sql =`SELECT titre AS title , date AS start , couleur AS backgroundColor,TRUE AS allDay FROM evenements`
    db.query(sql,(err,result) =>{
        if(err){
            console.error("erreur select :",err);
            return res.status(500).json({error:"erreur serveur"})
        }
        res.status(200).json(result)
    })
}
module.exports = {saveEvent,getEvent}
const express = require('express')
const {enregistrerInfosPreinscription,getPreinscriptionNonValidees,validerPreinscription,getPlacesRestantes,updatePreinscription} = require("../controllers/preinscriptionController")

const router = express.Router();

router.post("/",enregistrerInfosPreinscription);
router.get("/nonValidees",getPreinscriptionNonValidees);
router.post("/valider",validerPreinscription);
router.get("/places",getPlacesRestantes)


module.exports = router;
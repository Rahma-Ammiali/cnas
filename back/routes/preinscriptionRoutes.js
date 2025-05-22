const express = require('express')
<<<<<<< HEAD
const {enregistrerInfosPreinscription,getPreinscriptionNonValidees,validerPreinscription,getPlacesRestantes,updatePreinscription} = require("../controllers/preinscriptionController")
=======
const {enregistrerInfosPreinscription,getPreinscriptionNonValidees,validerPreinscription,getPlacesRestantes} = require("../controllers/preinscriptionController")
>>>>>>> recuperation-modifs

const router = express.Router();

router.post("/",enregistrerInfosPreinscription);
router.get("/nonValidees",getPreinscriptionNonValidees);
router.post("/valider",validerPreinscription);
router.get("/places",getPlacesRestantes)
<<<<<<< HEAD

=======
>>>>>>> recuperation-modifs

module.exports = router;
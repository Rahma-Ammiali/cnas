const express = require('express')
const {enregistrerInfosPreinscription,getPreinscriptionNonValidees,validerPreinscription} = require("../controllers/preinscriptionController")

const router = express.Router();

router.post("/",enregistrerInfosPreinscription);
router.get("/nonValidees",getPreinscriptionNonValidees);
router.post("/valider",validerPreinscription);

module.exports = router;
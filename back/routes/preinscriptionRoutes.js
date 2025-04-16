const express = require('express')
const {enregistrerInfosPreinscription} = require("../controllers/preinscriptionController")

const router = express.Router();

router.post("/",enregistrerInfosPreinscription);

module.exports = router;
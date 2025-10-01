const express = require('express');
const router = express.Router();
const { ajouterUtilisateur } = require('../controllers/utilisateurController');

router.post('/ajouter',ajouterUtilisateur);

module.exports = router ;
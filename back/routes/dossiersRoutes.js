const express = require('express');
const router = express.Router();
const { recupererEnfantsValides, getDossierById } = require('../controllers/dossiersController');

// Route pour les dossiers validés
router.get('/valides', recupererEnfantsValides);

// Nouvelle route pour les détails d'un dossier spécifique
router.get('/:id', getDossierById);

module.exports = router;
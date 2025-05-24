const express = require('express');
const router = express.Router();
const { recupererEnfantsValides, getDossiersById } = require('../controllers/dossiersController');

// Route pour les dossiers validés
router.get('/valides', recupererEnfantsValides);

// Route pour les détails d'un dossier spécifique
router.get('/:id', getDossiersById);

module.exports = router;
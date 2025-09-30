const express = require('express');
const router = express.Router();
const { recupererEnfantsValides, getDossiersById, setDateSortie, listerEnfantsSortis, reinscrireEnfant, getHistorique } = require('../controllers/dossiersController');

// Route pour les dossiers validés
router.get('/valides', recupererEnfantsValides);

// Enfants sortis
router.get('/sortis', listerEnfantsSortis);
router.put('/:id/sortie', setDateSortie);
router.put('/:id/reinscrire', reinscrireEnfant);
router.get('/:id/historique', getHistorique);

// Route pour les détails d'un dossier spécifique
router.get('/:id', getDossiersById);

module.exports = router;
const express = require('express');
const { createPaiement, getPaiementsByDossier, validerPaiement } = require('../controllers/paiementsController');

const router = express.Router();

router.post('/', createPaiement);
router.get('/:dossierId', getPaiementsByDossier);
router.put('/:id/valider', validerPaiement);

module.exports = router;

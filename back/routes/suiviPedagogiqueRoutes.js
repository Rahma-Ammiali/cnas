const express = require('express');
const router = express.Router();
const { getSuiviPedagogique, updateSuiviPedagogique } = require('../controllers/suiviPedagogiqueController');

// Route pour obtenir le suivi pédagogique d'un enfant
router.get('/:id_enfant', getSuiviPedagogique);

// Route pour mettre à jour le suivi pédagogique
router.post('/:id_enfant', updateSuiviPedagogique);

module.exports = router; 
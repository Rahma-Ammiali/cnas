const express = require('express');
const router = express.Router();
const suiviPedagogiqueController = require('../controllers/suiviPedagogiqueController');

// Route pour récupérer le suivi pédagogique d'un enfant
router.get('/:id_enfant', suiviPedagogiqueController.getSuiviPedagogique);

// Route pour mettre à jour ou créer un suivi pédagogique
router.post('/:id_enfant', suiviPedagogiqueController.updateSuiviPedagogique);

// Route pour valider un suivi pédagogique
router.put('/:id_enfant/valider', suiviPedagogiqueController.validerSuiviPedagogique);

module.exports = router; 
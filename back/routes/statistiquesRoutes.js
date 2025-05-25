const express = require('express');
const router = express.Router();
const { getStatistiques } = require('../controllers/statistiquesController');

// Route pour obtenir les statistiques
router.get('/', getStatistiques);

module.exports = router; 
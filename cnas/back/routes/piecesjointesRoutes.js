const express = require('express');
const router = express.Router();
const piecesJointesController = require('../controllers/piecesJointesController');
const multer = require('multer');
const path = require('path');

// Configuration de multer pour l'upload de fichiers
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/pieces-jointes/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Routes pour les pièces jointes
router.post('/upload/:dossierId', upload.single('file'), piecesJointesController.uploadPieceJointe);
router.get('/dossier/:dossierId', piecesJointesController.getPiecesJointesByDossier);
router.get('/download/:id', piecesJointesController.telechargerPieceJointe);
router.put('/valider/:id', piecesJointesController.validerPieceJointe);

module.exports = router;
const express = require("express");
const cors = require("cors");
const db = require("./db");
const dotenv = require("dotenv");
const path = require('path');

// Import des routes
const parentRoutes = require("./routes/parentRoutes");
const enfantRoutes = require("./routes/enfantRoutes");
const preinscriptionRoutes = require("./routes/preinscriptionRoutes");
const utilisateurRoutes = require("./routes/utilisateurRoutes");
const eventRoutes = require("./routes/eventRoutes");
const classesRoutes = require("./routes/classesRoutes");
const enAttenteRoutes = require("./routes/enAttenteRoutes");
const dossiersRoutes = require("./routes/dossiersRoutes");
const suiviPedagogiqueRoutes = require("./routes/suiviPedagogiqueRoutes");
const statistiquesRoutes = require("./routes/statistiquesRoutes");
const piecesJointesRoutes = require("./routes/piecesjointesRoutes");
const paiementsRoutes = require("./routes/paiementsRoutes");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route de login
app.post('/login', (req, res) => {
  const { numSecurite, password } = req.body;
  const query = 'SELECT * FROM login WHERE num_securite = ? AND password = ?';
  
  db.query(query, [numSecurite, password], (err, results) => {
    if (err) {
      console.error('Erreur de connexion:', err);
      return res.status(500).json({ message: "Erreur de connexion" });
    }
    
    if (results.length > 0) {
      res.json({ message: "Logged in successfully" });
    } else {
      res.json({ message: "Login failed" });
    }
  });
});

// Servir les fichiers statiques
app.use('/uploads', express.static('uploads'));

// Configuration des routes
app.use("/api/parents", parentRoutes);
app.use("/api/enfants", enfantRoutes);
app.use("/api/preinscription", preinscriptionRoutes);
app.use("/api/utilisateur", utilisateurRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/classes", classesRoutes);
app.use("/api/enAttente", enAttenteRoutes);
app.use("/api/dossiers", dossiersRoutes);
app.use("/api/suivi-pedagogique", suiviPedagogiqueRoutes);
app.use("/api/statistiques", statistiquesRoutes);
app.use("/api/pieces-jointes", piecesJointesRoutes);
app.use("/api/paiements", paiementsRoutes);

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);
  res.status(500).json({ 
    error: 'Erreur serveur',
    message: err.message 
  });
});

// Gestion des routes non trouvées
app.use((req, res) => {
  console.log('Route non trouvée:', req.path);
  res.status(404).json({ 
    error: 'Route non trouvée',
    path: req.path 
  });
});

const PORT = process.env.PORT || 5000;

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log('Routes disponibles :');
  console.log('- /api/parents');
  console.log('- /api/enfants');
  console.log('- /api/preinscription');
  console.log('- /api/utilisateur');
  console.log('- /api/event');
  console.log('- /api/classes');
  console.log('- /api/enAttente');
  console.log('- /api/dossiers');
  console.log('- /api/suivi-pedagogique');
  console.log('- /api/statistiques');
  console.log('- /api/pieces-jointes');
  console.log('- /api/paiements');
});
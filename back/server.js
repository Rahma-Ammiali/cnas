const express = require("express");
const cors = require ("cors");
const db = require("./db")
const dotenv = require("dotenv");
const multer = require('multer');
const path = require('path');
const parentRoutes = require("./routes/parentRoutes");
const enfantRoutes = require("./routes/enfantRoutes");
const preinscriptionRoutes= require("./routes/preinscriptionRoutes");
const utilisateurRoutes = require("./routes/utilisateurRoutes")
const eventRoutes = require("./routes/eventRoutes")
const classesRoutes = require("./routes/classesRoutes")
const enAttenteRoutes = require("./routes/enAttenteRoutes")
const dossiersRoutes = require("./routes/dossiersRoutes")
const suiviPedagogiqueRoutes = require("./routes/suiviPedagogiqueRoutes")
const statistiquesRoutes = require("./routes/statistiquesRoutes")
const piecesJointesRoutes = require('./routes/piecesjointesRoutes');

dotenv.config();
const app = express();

// Configuration de multer pour l'upload de fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/pieces-jointes/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Type de fichier non autorisé'));
    }
  }
});

// Servir les fichiers statiques
app.use('/uploads', express.static('uploads'));

app.use(cors());
app.use(express.json());

app.use("/api/pieces-jointes", piecesJointesRoutes);
app.use("/api/enfant/parents",parentRoutes);
app.use("/api/enfant",enfantRoutes);
app.use("/api/preinscription",preinscriptionRoutes)
app.use("/api/utilisateurs",utilisateurRoutes)
app.use("/api/events",eventRoutes)
app.use("/api/classes",classesRoutes)
app.use("/api/enattente",enAttenteRoutes)
app.use("/api/dossiers",dossiersRoutes)
app.use("/api/suivi",suiviPedagogiqueRoutes)
app.use("/api/statistiques", statistiquesRoutes)

app.post('/login',(req,res)=>{
    console.log("req body " ,req.body)
    const sql = "SELECT * FROM login WHERE num_securite = ? AND password = ? ";
    console.log("SQL Query:", sql);
    console.log("Parameters:", [req.body.numSecurite, req.body.password]);
    db.query(sql , [req.body.numSecurite,req.body.password] , (err,data)=>{
        if(err) return res.json("login failed ");
        if(data.length>0){
            return res.json({message:"Logged in successfully"});
        }else{
            return res.json("no record ");
        }
        
    })
})

// Gestion des erreurs globale
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: "Une erreur est survenue sur le serveur",
        details: err.message 
    });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
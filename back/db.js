const mysql = require('mysql2');
const dotenv = require("dotenv");

dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'creche',
    port: process.env.DB_PORT || 3306
});

// Tester la connexion
db.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données:', err);
        return;
    }
    console.log('Connecté à la base de données MySQL');

    // Afficher les tables disponibles
    db.query('SHOW TABLES', (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des tables:', err);
            return;
        }
        console.log('Tables disponibles dans la base de données:', results);
    });
});

module.exports = db;
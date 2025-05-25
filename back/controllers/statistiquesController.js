const db = require('../db');

const getStatistiques = (req, res) => {
    console.log('Début de la requête getStatistiques');

    // Requête pour le total des enfants avec préinscription validée
    const queryTotal = `
        SELECT COUNT(DISTINCT e.id) as total 
        FROM enfants e 
        INNER JOIN preinscriptions p ON e.id = p.id_enfant 
        WHERE p.valide = 1
    `;

    db.query(queryTotal, (err, totalResults) => {
        if (err) {
            console.error('Erreur lors de la requête total:', err);
            return res.status(500).json({
                error: "Erreur lors du comptage total",
                details: err.message
            });
        }

        // Requête pour la répartition par sexe
        const querySexe = `
            SELECT e.sexe, COUNT(DISTINCT e.id) as nombre 
            FROM enfants e
            INNER JOIN preinscriptions p ON e.id = p.id_enfant 
            WHERE p.valide = 1 AND e.sexe IS NOT NULL
            GROUP BY e.sexe
        `;

        db.query(querySexe, (err, sexeResults) => {
            if (err) {
                console.error('Erreur lors de la requête sexe:', err);
                return res.status(500).json({
                    error: "Erreur lors du comptage par sexe",
                    details: err.message
                });
            }

            // Requête pour la répartition par âge/section
            const queryAge = `
                SELECT 
                    CASE 
                        WHEN TIMESTAMPDIFF(YEAR, e.date_naissance, CURDATE()) <= 3 THEN 'Petite Section'
                        WHEN TIMESTAMPDIFF(YEAR, e.date_naissance, CURDATE()) = 4 THEN 'Moyenne Section'
                        ELSE 'Grande Section'
                    END as tranche_age,
                    COUNT(DISTINCT e.id) as nombre
                FROM enfants e
                INNER JOIN preinscriptions p ON e.id = p.id_enfant 
                WHERE p.valide = 1
                GROUP BY 
                    CASE 
                        WHEN TIMESTAMPDIFF(YEAR, e.date_naissance, CURDATE()) <= 3 THEN 'Petite Section'
                        WHEN TIMESTAMPDIFF(YEAR, e.date_naissance, CURDATE()) = 4 THEN 'Moyenne Section'
                        ELSE 'Grande Section'
                    END
            `;

            db.query(queryAge, (err, ageResults) => {
                if (err) {
                    console.error('Erreur lors de la requête âge:', err);
                    return res.status(500).json({
                        error: "Erreur lors du comptage par âge",
                        details: err.message
                    });
                }

                // Formater les résultats pour le sexe
                const formattedSexeResults = sexeResults.map(item => ({
                    sexe: item.sexe === 'M' ? 'Garçons' : 'Filles',
                    nombre: item.nombre
                }));

                res.json({
                    totalEnfants: totalResults[0].total,
                    parSexe: formattedSexeResults,
                    parAge: ageResults
                });
            });
        });
    });
};

module.exports = {
    getStatistiques
}; 
const db = require('../db');

const getStatistiques = (req, res) => {
    console.log('Début de la requête getStatistiques');

    const queryTotal = `
        SELECT COUNT(*) as total 
        FROM enfants e 
        INNER JOIN preinscriptions p ON e.id = p.id_enfant 
        WHERE p.valide = 1 AND e.date_sortie IS NULL
    `;

    db.query(queryTotal, (err, totalResults) => {
        if (err) {
            console.error('Erreur lors de la requête total:', err);
            return res.status(500).json({
                error: "Erreur lors du comptage total",
                details: err.message
            });
        }

        const querySexe = `
            SELECT e.sexe, COUNT(*) as nombre 
            FROM enfants e
            INNER JOIN preinscriptions p ON e.id = p.id_enfant 
            WHERE p.valide = 1 AND e.sexe IS NOT NULL AND e.date_sortie IS NULL
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

            const queryAge = `
                SELECT 
                    CASE 
                        WHEN TIMESTAMPDIFF(YEAR, e.date_naissance, CURDATE()) <= 3 THEN 'Petite Section'
                        WHEN TIMESTAMPDIFF(YEAR, e.date_naissance, CURDATE()) = 4 THEN 'Moyenne Section'
                        ELSE 'Grande Section'
                    END as tranche_age,
                    COUNT(*) as nombre
                FROM enfants e
                INNER JOIN preinscriptions p ON e.id = p.id_enfant 
                WHERE p.valide = 1 AND e.date_sortie IS NULL
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

                // Nouveaux KPI
                const querySortis = `
                  SELECT COUNT(*) AS nb_sortis
                  FROM enfants
                  WHERE date_sortie IS NOT NULL
                `;

                db.query(querySortis, (err, sortisResults) => {
                  if (err) {
                    console.error('Erreur nb_sortis:', err);
                    return res.status(500).json({ error: 'Erreur nb_sortis' });
                  }

                  // Année scolaire courante
                  const now = new Date();
                  const y = now.getFullYear();
                  const m = now.getMonth() + 1;
                  const annee = (m >= 9) ? `${y}-${y+1}` : `${y-1}-${y}`;

                  const queryAvecPaiement = `
                    SELECT COUNT(DISTINCT e.id) AS nb_avec_paiement
                    FROM enfants e
                    INNER JOIN preinscriptions p ON e.id = p.id_enfant AND p.valide = 1
                    INNER JOIN paiements pay ON pay.dossier_id = e.id AND pay.annee_scolaire = ?
                    WHERE e.date_sortie IS NULL
                  `;

                  db.query(queryAvecPaiement, [annee], (err, avecPay) => {
                    if (err) {
                      console.error('Erreur nb avec paiement:', err);
                      return res.status(500).json({ error: 'Erreur nb avec paiement' });
                    }

                    const nbAvec = avecPay[0]?.nb_avec_paiement || 0;
                    const nbTotal = totalResults[0].total || 0;
                    const nbSans = Math.max(0, nbTotal - nbAvec);

                    const formattedSexeResults = sexeResults.map(item => ({
                        sexe: item.sexe === 'M' ? 'Garçons' : 'Filles',
                        nombre: item.nombre
                    }));

                    res.json({
                        totalEnfants: nbTotal,
                        parSexe: formattedSexeResults,
                        parAge: ageResults,
                        nbSortis: sortisResults[0]?.nb_sortis || 0,
                        nbAvecPaiement: nbAvec,
                        nbSansPaiement: nbSans,
                        anneeScolaire: annee
                    });
                  });
                });
            });
        });
    });
};

module.exports = {
    getStatistiques
}; 
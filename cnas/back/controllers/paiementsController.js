const db = require('../db');

function computeAnneeScolaireFromNow() {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1; // 1..12
  if (m >= 9) return `${y}-${y + 1}`;
  return `${y - 1}-${y}`;
}

function createPaiement(req, res) {
  const {
    dossierId,
    months, // array of '09','10',...
    monthly_fee,
    motif,
    mode,
    recepisse,
    compte_debiteur,
    annee_scolaire
  } = req.body;

  if (!dossierId || !Array.isArray(months) || months.length === 0 || !monthly_fee || !mode) {
    return res.status(400).json({ error: 'Champs requis manquants' });
  }

  const annee = annee_scolaire || computeAnneeScolaireFromNow();

  const values = months.map((mm) => [
    dossierId,
    annee,
    parseInt(String(mm), 10),
    monthly_fee,
    motif || null,
    mode,
    recepisse || null,
    compte_debiteur || null,
    'En attente'
  ]);

  const sql = `
    INSERT INTO paiements (
      dossier_id, annee_scolaire, mois, monthly_fee, motif, mode, recepisse, compte_debiteur, statut_validation
    ) VALUES ?
  `;

  db.query(sql, [values], (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Un ou plusieurs mois sont déjà payés pour cette année scolaire' });
      }
      // Fallback to individual inserts to surface better errors if needed
      return insertIndividually();
    }
    return getPaiementsByDossier({ params: { dossierId } }, res);
  });

  function insertIndividually() {
    const insertOne = `
      INSERT INTO paiements (
        dossier_id, annee_scolaire, mois, monthly_fee, motif, mode, recepisse, compte_debiteur, statut_validation
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'En attente')
    `;

    let hasDup = false;
    let hasErr = false;
    let pending = values.length;

    values.forEach(v => {
      const params = [...v.slice(0, 8)];
      db.query(insertOne, params, (e) => {
        if (e) {
          if (e.code === 'ER_DUP_ENTRY') hasDup = true;
          else hasErr = true;
        }
        if (--pending === 0) {
          if (hasErr) return res.status(500).json({ error: 'Erreur serveur' });
          if (hasDup) return res.status(409).json({ error: 'Un ou plusieurs mois sont déjà payés pour cette année scolaire' });
          return getPaiementsByDossier({ params: { dossierId } }, res);
        }
      });
    });
  }
}

function getPaiementsByDossier(req, res) {
  const { dossierId } = req.params;
  db.query('SELECT * FROM paiements WHERE dossier_id = ? ORDER BY created_at DESC', [dossierId], (err, rows) => {
    if (err) {
      console.error('Erreur lecture paiements:', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    res.json(rows);
  });
}

function validerPaiement(req, res) {
  const { id } = req.params;
  db.query('UPDATE paiements SET statut_validation = "Validé" WHERE id = ?', [id], (err) => {
    if (err) {
      console.error('Erreur validation paiement:', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    db.query('SELECT * FROM paiements WHERE id = ?', [id], (e2, rows) => {
      if (e2) {
        return res.json({ id, statut_validation: 'Validé' });
      }
      res.json(rows[0] || { id, statut_validation: 'Validé' });
    });
  });
}

module.exports = { createPaiement, getPaiementsByDossier, validerPaiement };

ALTER TABLE enfants
  ADD COLUMN date_sortie DATE NULL AFTER date_naissance,
  ADD INDEX idx_enfants_date_sortie (date_sortie);

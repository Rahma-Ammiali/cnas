ALTER TABLE suivi_pedagogique
ADD COLUMN statut_validation ENUM('En attente', 'Validé') DEFAULT 'En attente'; 
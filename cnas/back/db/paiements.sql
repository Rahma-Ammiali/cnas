CREATE TABLE IF NOT EXISTS paiements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dossier_id INT NOT NULL,
  months VARCHAR(50) NOT NULL,
  monthly_fee DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) DEFAULT NULL,
  motif VARCHAR(50) DEFAULT NULL,
  mode VARCHAR(20) NOT NULL,
  recepisse VARCHAR(50) DEFAULT NULL,
  compte_debiteur VARCHAR(50) DEFAULT NULL,
  statut_validation ENUM('En attente','Validé') DEFAULT 'En attente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

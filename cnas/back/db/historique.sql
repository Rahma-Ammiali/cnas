CREATE TABLE IF NOT EXISTS historique_enfant (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_enfant INT NOT NULL,
  type ENUM('depot','sortie','reinscription') NOT NULL,
  date_evenement DATE NOT NULL,
  details VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_hist_enfant (id_enfant, date_evenement)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

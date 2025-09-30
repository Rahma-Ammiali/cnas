CREATE TABLE suivi_pedagogique (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_enfant INT NOT NULL,
    
    -- Section Adaptation
    obs_adaptation TEXT,
    statut_adaptation ENUM('Amélioration', 'Stagnation', 'Régression') DEFAULT NULL,
    
    -- Section Socialisation
    obs_socialisation TEXT,
    statut_socialisation ENUM('Amélioration', 'Stagnation', 'Régression') DEFAULT NULL,
    
    -- Section Autonomie
    obs_autonomie TEXT,
    statut_autonomie ENUM('Amélioration', 'Stagnation', 'Régression') DEFAULT NULL,
    
    -- Section Pré-mathématiques
    obs_premath TEXT,
    statut_premath ENUM('Amélioration', 'Stagnation', 'Régression') DEFAULT NULL,
    
    -- Section Pré-lecture
    obs_prelecture TEXT,
    statut_prelecture ENUM('Amélioration', 'Stagnation', 'Régression') DEFAULT NULL,
    
    -- Section Pré-écriture
    obs_preecriture TEXT,
    statut_preecriture ENUM('Amélioration', 'Stagnation', 'Régression') DEFAULT NULL,
    
    -- Autres champs
    evenements_places TEXT,
    date_observation DATE,
    
    -- Statut de validation
    statut_validation ENUM('En attente', 'Validé') DEFAULT 'En attente',
    
    FOREIGN KEY (id_enfant) REFERENCES enfants(id)
); 
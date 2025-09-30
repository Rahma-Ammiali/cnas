CREATE TABLE IF NOT EXISTS pieces_jointes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_dossier INT NOT NULL,
    nom_document VARCHAR(255) NOT NULL,
    nom_fichier VARCHAR(255) NOT NULL,
    chemin_fichier VARCHAR(255) NOT NULL,
    type_mime VARCHAR(100),
    taille_fichier BIGINT,
    date_upload DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_dossier) REFERENCES enfants(id)
); 
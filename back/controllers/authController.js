const db = require ('../db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');


const login = (req, res) => {
  const { num_agent, password } = req.body;
  const q = "SELECT * FROM utilisateurs WHERE num_agent = ?";

  db.query(q, [num_agent], async (err, data) => {
    if (err) return res.status(500).json({ message: "database error" });

    if (data.length === 0) {
      console.log("Aucun utilisateur trouvé avec num_agent :", num_agent);
      return res.status(404).json({ message: "user not found" });
    }

    const user = data[0];
    console.log("Mot de passe saisi :", password);
    console.log("Mot de passe stocké (hashé) :", user.password);

    try {
      const validPassword = await bcrypt.compare(password, user.password);
      console.log("Mot de passe valide :", validPassword);

      if (!validPassword) {
        return res.status(401).json({ message: "invalid credentials" });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role, nom: user.nom },
        'jwt_secret_key',
        { expiresIn: '1d' }
      );

      return res.status(200).json({
        token,
        user: {
          id: user.id,
          nom: user.nom,
          num_agent: user.num_agent,
          role: user.role,
        },
      });

    } catch (error) {
      console.error("Erreur lors de la comparaison du mot de passe :", error);
      return res.status(500).json({ message: "erreur interne" });
    }
  });
};


module.exports = {login}
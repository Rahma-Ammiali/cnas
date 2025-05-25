import React, { useState } from 'react'
import Side from '../components/Side'
import { FaRegEye, FaRegEyeSlash, FaUser, FaIdCard, FaUserTag, FaKey } from "react-icons/fa";

const Utilisateur = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    numAgent: '',
    role: '',
    password: ''
  });

  const handleChange = ({target: {name, value}}) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/utilisateur/ajouter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert("Utilisateur ajouté avec succès !");
        setFormData({nom: '', numAgent: '', role: '', password: ''});
      } else {
        const errorData = await response.json();
        alert("Erreur lors de l'ajout de l'utilisateur");
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
      alert("Une erreur s'est produite. Vérifiez votre connexion.");
    }
  };

  return (
    <Side>
      <div className="min-h-screen bg-gradient-to-b from-white to-[#f0f7ff] p-6">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold text-center">
            <span className="bg-gradient-to-r from-[#00428C] to-[#006DB8] text-transparent bg-clip-text">
              Ajouter un nouveau utilisateur
            </span>
          </h1>

          <div className="bg-white rounded-2xl p-8 shadow-[0_10px_30px_rgba(8,_112,_184,_0.2)]">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm text-[#00428C]/70 font-medium block">
                  Nom
                </label>
                <div className="relative">
                  <input 
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                    className="
                      w-full px-6 py-4 bg-[#DAEAF4] rounded-lg
                      text-[#00428C] placeholder-[#00428C]/50
                      focus:outline-none focus:ring-2 focus:ring-[#006DB8]
                      transition-all duration-300
                      pl-12
                    "
                    placeholder="Entrez le nom de l'utilisateur"
                  />
                  <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00428C]/50" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-[#00428C]/70 font-medium block">
                  Numéro d'agent
                </label>
                <div className="relative">
                  <input 
                    type="text"
                    name="numAgent"
                    value={formData.numAgent}
                    onChange={handleChange}
                    required
                    className="
                      w-full px-6 py-4 bg-[#DAEAF4] rounded-lg
                      text-[#00428C] placeholder-[#00428C]/50
                      focus:outline-none focus:ring-2 focus:ring-[#006DB8]
                      transition-all duration-300
                      pl-12
                    "
                    placeholder="Entrez le numéro d'agent"
                  />
                  <FaIdCard className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00428C]/50" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-[#00428C]/70 font-medium block">
                  Rôle
                </label>
                <div className="relative">
                  <select 
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    className="
                      w-full px-6 py-4 bg-[#DAEAF4] rounded-lg
                      text-[#00428C] placeholder-[#00428C]/50
                      focus:outline-none focus:ring-2 focus:ring-[#006DB8]
                      transition-all duration-300
                      pl-12
                      appearance-none
                    "
                  >
                    <option value="">-- Choisir un rôle --</option>
                    <option value="directrice">Directrice</option>
                    <option value="educatrice">Educatrice</option>
                    <option value="educatrice en chef">Educatrice en chef</option>
                    <option value="secretaire">Secrétaire</option>
                    <option value="econome">Econome</option>
                    <option value="agent_cnas">Agent CNAS</option>
                    <option value="admin">Admin</option>
                  </select>
                  <FaUserTag className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00428C]/50" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-[#00428C]/70 font-medium block">
                  Mot de passe
                </label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="
                      w-full px-6 py-4 bg-[#DAEAF4] rounded-lg
                      text-[#00428C] placeholder-[#00428C]/50
                      focus:outline-none focus:ring-2 focus:ring-[#006DB8]
                      transition-all duration-300
                      pl-12 pr-12
                    "
                    placeholder="Entrez le mot de passe"
                  />
                  <FaKey className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00428C]/50" />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#00428C]/50 hover:text-[#00428C] transition-colors duration-300"
                  >
                    {showPassword ? <FaRegEye className="w-5 h-5" /> : <FaRegEyeSlash className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setFormData({nom: '', numAgent: '', role: '', password: ''})}
                  className="
                    px-6 py-3 rounded-lg
                    bg-gray-500 text-white
                    hover:bg-gray-600
                    transition-all duration-300
                    transform hover:scale-105
                  "
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="
                    px-6 py-3 rounded-lg
                    bg-[#00428C] text-white
                    hover:bg-[#006DB8]
                    transition-all duration-300
                    transform hover:scale-105
                  "
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Side>
  );
};

export default Utilisateur;
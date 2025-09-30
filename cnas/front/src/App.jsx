import { BrowserRouter, Routes, Route } from "react-router-dom"
import Log from "./pages/Log"
import Acceuil from "./pages/Acceuil"
import Preinscription from "./pages/Preinscription"
import EnAttente from "./pages/EnAttente"
import Dossiers from "./pages/Dossiers"
import DossiersDetails from "./pages/DossiersDetails"
import SuiviPedagogique from "./pages/SuiviPedagogique"
import Utilisateur from "./pages/Utilisateur"
import Evenement from "./pages/Evenement"
import Statistiques from "./pages/Statistiques"
import PiecesJointes from './components/piecesjointes';
import Side from './components/Side';
import SuiviDePayement from "./pages/SuiviDePayement"
import EnfantsSortis from "./pages/EnfantsSortis"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Log />} />
        <Route path="/acceuil" element={<Acceuil />} />
        <Route path="/preinscription" element={<Preinscription />} />
        <Route path="/enAttente" element={<EnAttente />} />
        <Route path="/dossiers" element={<Dossiers />} />
        <Route path="/dossiers/:id" element={<DossiersDetails />} />
        <Route path="/pieces-jointes/:dossierId" element={<PiecesJointes />} />
        <Route path="/suivi-pedagogique/:id" element={<SuiviPedagogique />} />
        <Route path="/utilisateur" element={<Utilisateur />} />
        <Route path="/evenement" element={<Evenement />} />
        <Route path="/statistiques" element={<Statistiques />} />
        <Route path="/suivi-de-payement/:id" element={<SuiviDePayement />} />
        <Route path="/enfants-sortis" element={<EnfantsSortis />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

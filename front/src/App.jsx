import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import PrivateRoute from "./pages/PrivateRoute"
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Navigate to="/accueil" />} />
        <Route path="/" element={<Log />} />
        <Route element= {<PrivateRoute allowedRoles={["admin","directrice","secretaire","educatrice","educatrice en chef","econome","agent_cnas"]} />}>
        <Route path="/acceuil" element={<Acceuil />} />
        </Route>
        <Route element= {<PrivateRoute allowedRoles={["directrice","educatrice","educatrice en chef","agent_cnas"]} />}>
        <Route path="/pieces-jointes/:dossierId" element={<PiecesJointes />} />
        <Route path="/suivi-pedagogique/:id" element={<SuiviPedagogique />} />
        </Route>
        <Route element= {<PrivateRoute allowedRoles={["secretaire"]} />}>
        <Route path="/preinscription" element={<Preinscription />} />
        </Route>
        <Route element= {<PrivateRoute allowedRoles={["directrice"]} />}>
        <Route path="/enAttente" element={<EnAttente />} />
        </Route>
        <Route element= {<PrivateRoute allowedRoles={["directrice","secretaire","educatrice","educatrice en chef","agent_cnas"]} />}>
        <Route path="/dossiers" element={<Dossiers />} />
        <Route path="/dossiers/:id" element={<DossiersDetails />} />
        </Route>
        <Route element= {<PrivateRoute allowedRoles={["admin"]} />}>
        <Route path="/utilisateur" element={<Utilisateur />} />
        </Route>
        <Route element= {<PrivateRoute allowedRoles={["directrice"]} />}>
        <Route path="/evenement" element={<Evenement />} />
        </Route>
        <Route element= {<PrivateRoute allowedRoles={["directrice","agent_cnas"]} />}>
        <Route path="/statistiques" element={<Statistiques />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

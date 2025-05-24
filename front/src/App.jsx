import {RouterProvider, createBrowserRouter} from 'react-router-dom';
import './App.css'
import Dashboard from './pages/Dashboard'
import Log from './pages/Log';
import Dossiers from './pages/Dossiers';
import Preinscription from './pages/Preinscription';
import EnAttente from './pages/EnAttente';
import Utilisateur from './pages/Utilisateur';
import Acceuil from './pages/Acceuil';
import Evenement from './pages/Evenement';
import DetailsModal from './components/DetailsModal';
import DossiersDetails from './pages/DossiersDetails';

function App() {
  const router = createBrowserRouter([
    {
      path:"/",
      element:<Log />
    },
    {
      path:"/Dashboard",
      element:<Dashboard />
    },
    {
      path:"/Preinscription",
      element:<Preinscription />
    },
    {
      path:"/EnAttente",
      element:<EnAttente />
    },
    {
      path:"/Dossiers",
      children : [
        {
          index:true,
          element:<Dossiers />
        },
        {
          path:":id",
          element:<DossiersDetails />
        }
      ]
    },
    {
      path:"/Utilisateur",
      element:<Utilisateur />
    },
    {
      path:"/Acceuil",
      element:<Acceuil />
    },
    {
      path:"/Evenement",
      element:<Evenement />
    },
    {
      path:"/DetailsModal",
      element:<DetailsModal />
    },
    
  ])
  return (
    <RouterProvider router={router} />
  )
}

export default App

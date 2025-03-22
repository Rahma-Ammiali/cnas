import {RouterProvider, createBrowserRouter} from 'react-router-dom';
import './App.css'
import Dashboard from './pages/Dashboard'
import Sign from './pages/Sign'
import Home from './pages/Home'
import Log from './pages/Log';
import Utilisateur from './pages/Utilisateur'
function App() {
  const router = createBrowserRouter([
    {
      path:"/",
      element:<Log />
    },
    {
      path:"/Utilisateur",
      element:<Utilisateur />
    },
    {
      path:"/Sign",
      element:<Sign />
    },
    {
      path:"/Dashboard",
      element:<Dashboard />
    },
    {
      path:"/Home",
      element:<Home />
    }
  ])
  return (
    <RouterProvider router={router} />
  )
}

export default App

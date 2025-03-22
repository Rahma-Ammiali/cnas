import {RouterProvider, createBrowserRouter} from 'react-router-dom';
import './App.css'
import Dashboard from './pages/Dashboard'
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

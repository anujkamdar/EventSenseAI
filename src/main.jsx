import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Layout from './Layout.jsx'
import AttendeeDashboard from './Attendeedash.jsx'
import LandingPage from './LandingPage.jsx'
import OrganizerDashboard from './organizerdash.jsx'


const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: "",
        element: <LandingPage/>

      },
      {
        path: "organizerdash",
        element: <OrganizerDashboard />,
      },
      {
        path: "attendeedash",
        element: <AttendeeDashboard />
      }]
  }

])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

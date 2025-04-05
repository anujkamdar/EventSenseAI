import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LandingPage from './LandingPage'
import OrganizerDashboard from './Organizerdash'
import AttendeeDashboard from './Attendeedash'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <LandingPage /> */}
    <OrganizerDashboard/>
  </StrictMode>,
)

import { createRoot } from 'react-dom/client'
import './index.css'
import RouterApp from './router.tsx'
import React from 'react'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterApp />
  </React.StrictMode>

)

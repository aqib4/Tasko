import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ReduxProvider } from './redux/provider/reduxProvider.jsx'

createRoot(document.getElementById('root')).render(

  <StrictMode>
    <ReduxProvider >
      <App />
    </ReduxProvider>
  </StrictMode>,
)

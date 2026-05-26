import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Importando o Bootstrap completo (CSS e JS para os Modais funcionarem)
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
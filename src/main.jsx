import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx' // 1. Importa seu App.jsx principal

// 2. Importa o CSS do Bootstrap (essencial!)
import 'bootstrap/dist/css/bootstrap.min.css' 

// 3. Renderiza o seu App dentro do HTML
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
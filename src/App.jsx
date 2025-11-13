import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Identificador from './Identificador.jsx';
import Treinamento from './Treinamento.jsx';

function App() {
  // Define a tela inicial como 'identificar'
  const [view, setView] = useState('identificar'); 

  return (
    <div className="container mt-4">
      <h1 className="mb-4">⚡ App de Identificação de Aparelhos (IA)</h1>

      {/* Navegação por abas */}
      <nav className="nav nav-tabs mb-3">
        <button
          className={`nav-link ${view === 'identificar' ? 'active' : ''}`}
          onClick={() => setView('identificar')}
        >
          Identificar
        </button>
        <button
          className={`nav-link ${view === 'treinamento' ? 'active' : ''}`}
          onClick={() => setView('treinamento')}
        >
          Treinamento
        </button>
      </nav>

      {/* Renderiza a tela correta com base no estado 'view' */}
      <div className="card">
        <div className="card-body">
          {view === 'identificar' ? <Identificador /> : <Treinamento />}
        </div>
      </div>
    </div>
  );
}

export default App;
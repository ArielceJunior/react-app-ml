import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from './api'; // Sua configuração do Axios

function Identificador() {
  const [status, setStatus] = useState('Ocioso. Clique para identificar.');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);

  const handleIdentificar = async () => {
    setLoading(true);
    setStatus('Lendo consumo em tempo real...');
    setResultado(null);

    try {
      // Chama a rota nova que criamos no Python
      const response = await api.get('/api/identificar');
      
      // O backend retorna: { identificado: "Nome", watts_atuais: 123.4, diferenca: 5.0 }
      setResultado(response.data);
      setStatus('Análise concluída.');
      setLoading(false);

    } catch (error) {
      console.error('Erro ao identificar:', error);
      setLoading(false);
      
      if (error.response && error.response.status === 404) {
        setStatus("Erro 404: A rota '/api/identificar' não foi encontrada. Reinicie o Python.");
      } else {
        setStatus("Erro de conexão. Verifique se o Backend está rodando.");
      }
    }
  };

  return (
    <div className="p-4 container" style={{ maxWidth: '600px' }}>
      <h3 className="mb-4">Identificador de Aparelhos</h3>

      <div className="mb-3">
        <button 
          className="btn btn-success btn-lg w-50" 
          onClick={handleIdentificar}
          disabled={loading}
        >
          {loading ? (
            <span><span className="spinner-border spinner-border-sm me-2"></span>Analisando...</span>
          ) : (
            "🔍 Identificar"
          )}
        </button>
      </div>

      {/* Área de Status Simples */}
      <div className="alert alert-secondary text-center">
        {status}
      </div>

      {/* Cartão de Resultado */}
      {resultado && (
        <div className={`card mt-4 border-${resultado.identificado === "Desconhecido" ? "warning" : "primary"}`}>
          <div className="card-header bg-transparent">
            Resultado da Análise
          </div>
          <div className="card-body text-center">
            
            <h5 className="text-muted mb-1">O aparelho parece ser:</h5>
            <h2 className="card-title text-primary fw-bold display-6">
              {resultado.identificado}
            </h2>
            
            <hr />
            
            <div className="row mt-3">
              <div className="col-6">
                <small className="text-muted">Consumo Atual</small>
                <p className="h5">{resultado.watts_atuais?.toFixed(1)} W</p>
              </div>
              <div className="col-6">
                <small className="text-muted">Diferença (Erro)</small>
                <p className="h5 text-muted">± {resultado.diferenca?.toFixed(1)} W</p>
              </div>
            </div>

            {resultado.identificado === "Desconhecido" && (
              <div className="alert alert-warning mt-3 mb-0">
                <small>{resultado.detalhe}</small>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Identificador;
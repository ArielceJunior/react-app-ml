import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from './api'; // Importa nossa configuração do Axios

function Identificador() {
  const [status, setStatus] = useState('Ocioso');
  const [resultado, setResultado] = useState(null); // Armazena o resultado da IA

  // Função chamada pelo botão "Identificar"
  const handleIdentificar = async () => {
    setStatus('Aguardando sinal... Ligue o aparelho! (Pode levar até 5 min)');
    setResultado(null); // Limpa o resultado anterior

    try {
      // Chama a API do backend (app.py) e espera a resposta
      const response = await api.get('/api/identificar');

      if (response.data.success) {
        setStatus('Identificação Concluída!');
        setResultado(response.data); // Salva o objeto completo do resultado
      } else {
        setStatus(`Erro: ${response.data.error}`);
      }
    } catch (error) {
      console.error('Erro ao identificar:', error);
      setStatus(`Erro de conexão com o servidor. O 'app.py' está rodando?`);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-3">
        <button className="btn btn-success btn-lg" onClick={handleIdentificar}>
          Identificar Aparelho
        </button>
      </div>

      {/* Área de Status */}
      <div className="mt-4">
        <h2>Status:</h2>
        <p className="alert alert-info">{status}</p>
      </div>

      {/* Área de Resultado (só aparece se 'resultado' não for nulo) */}
      {resultado && (
        <div className="card mt-4">
          <div className="card-body">
            <h2 className="card-title">Resultado da Predição:</h2>
            <h3 className="alert alert-primary">
              Aparelho: <strong>{resultado.aparelho}</strong>
            </h3>
            <p>
              Nível de Confiança: <strong>{resultado.confianca}</strong>
            </p>
            <hr />
            <p>Features Detectadas:</p>
            <pre>{JSON.stringify(resultado.features_detectadas, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default Identificador;
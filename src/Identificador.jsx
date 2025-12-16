import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from './api'; // Sua configuração do Axios

function Identificador() {
  const [monitorando, setMonitorando] = useState(false);
  const [dados, setDados] = useState({
    watts_instantaneo: 0,
    watts_media_janela: 0,
    aparelho_identificado: "Aguardando..."
  });
  const [erro, setErro] = useState('');

  // UseRef para guardar o ID do intervalo e limpar depois
  const intervaloRef = useRef(null);

  // Função que busca os dados no Backend
  const buscarStatus = async () => {
    try {
      const response = await api.get('/api/status_atual');
      // O backend retorna: { watts_instantaneo, watts_media_janela, aparelho_identificado }
      setDados(response.data);
      setErro('');
    } catch (error) {
      console.error('Erro de conexão:', error);
      setErro('Erro de conexão com o servidor.');
      pararMonitoramento(); // Para se der erro grave
    }
  };

  const iniciarMonitoramento = () => {
    setMonitorando(true);
    buscarStatus(); // Busca a primeira vez imediatamente
    // Configura o loop a cada 1 segundo (1000ms)
    intervaloRef.current = setInterval(buscarStatus, 1000);
  };

  const pararMonitoramento = () => {
    setMonitorando(false);
    if (intervaloRef.current) {
      clearInterval(intervaloRef.current);
    }
  };

  // Limpeza: Se o usuário sair da página, para o loop
  useEffect(() => {
    return () => {
      if (intervaloRef.current) clearInterval(intervaloRef.current);
    };
  }, []);

  return (
    <div className="p-4 container" style={{ maxWidth: '700px' }}>
      <h3 className="mb-4 text-center">Monitor de Identificação (IA)</h3>

      {/* Botões de Controle */}
      <div className="d-grid gap-2 mb-4">
        {!monitorando ? (
          <button 
            className="btn btn-primary btn-lg" 
            onClick={iniciarMonitoramento}
          >
            ▶ Iniciar Monitoramento em Tempo Real
          </button>
        ) : (
          <button 
            className="btn btn-danger btn-lg" 
            onClick={pararMonitoramento}
          >
            ⏹ Parar Monitoramento
          </button>
        )}
      </div>

      {/* Alerta de Erro */}
      {erro && (
        <div className="alert alert-danger text-center">
          {erro}
        </div>
      )}

      {/* Painel Principal */}
      <div className="card shadow-sm">
        <div className="card-header bg-light text-center">
          Status: {monitorando ? <span className="text-success fw-bold">● ONLINE</span> : <span className="text-muted">OFFLINE</span>}
        </div>
        
        <div className="card-body text-center">
          
          <h6 className="text-muted mb-2">O aparelho conectado parece ser:</h6>
          
          {/* Nome do Aparelho (Destaque) */}
          <div 
            className="display-4 fw-bold mb-4" 
            style={{ 
              color: dados.aparelho_identificado.includes("Desconhecido") ? '#ffc107' : '#0d6efd' 
            }}
          >
            {dados.aparelho_identificado}
          </div>

          <hr />

          {/* Dados Técnicos */}
          <div className="row mt-4">
            {/* Leitura Instantânea (Ruidosa) */}
            <div className="col-md-6 mb-3">
              <div className="p-3 border rounded bg-light">
                <small className="text-muted d-block">Leitura Instantânea</small>
                <span className="h3 text-secondary">
                  {dados.watts_instantaneo?.toFixed(1)} W
                </span>
                <div style={{ fontSize: '0.8rem', color: '#999' }}>
                  (Dado bruto chegando do ESP32)
                </div>
              </div>
            </div>

            {/* Média da Janela (Estável) */}
            <div className="col-md-6 mb-3">
              <div className="p-3 border rounded bg-white border-primary">
                <small className="text-primary fw-bold d-block">Média (Janela 5s)</small>
                <span className="h3 text-dark">
                  {dados.watts_media_janela?.toFixed(1)} W
                </span>
                <div style={{ fontSize: '0.8rem', color: 'green' }}>
                  (Usado para Identificação)
                </div>
              </div>
            </div>
          </div>

        </div>
        <div className="card-footer text-muted text-center" style={{ fontSize: '0.8rem' }}>
          O sistema utiliza uma média móvel dos últimos 5 pontos para aumentar a precisão.
        </div>
      </div>
    </div>
  );
}

export default Identificador;
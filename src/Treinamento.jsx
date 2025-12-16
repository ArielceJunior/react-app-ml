import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from './api'; // Sua configuração do Axios

function Treinamento() {
  const [nomeAparelho, setNomeAparelho] = useState('');
  
  // Estados visuais
  const [statusTexto, setStatusTexto] = useState('Ocioso');
  const [alertType, setAlertType] = useState('alert-secondary'); // Cores do Bootstrap
  const [loading, setLoading] = useState(false);
  const [progresso, setProgresso] = useState(0);

  // Referência para o timer (setInterval)
  const intervaloRef = useRef(null);

  // Limpa o timer se o usuário sair da página
  useEffect(() => {
    return () => pararPolling();
  }, []);

  const pararPolling = () => {
    if (intervaloRef.current) {
      clearInterval(intervaloRef.current);
      intervaloRef.current = null;
    }
  };

  const handleChange = (e) => {
    setNomeAparelho(e.target.value);
  };

  // --- NOVA LÓGICA DE VERIFICAÇÃO (POLLING) ---
  const verificarStatus = async () => {
    try {
      const response = await api.get('/api/status_gravacao');
      const { status, mensagem, buffer } = response.data;

      console.log("Status Backend:", status);

      if (status === "AGUARDANDO_GATILHO") {
        setStatusTexto("⏳ AGORA LIGUE O APARELHO! Aguardando consumo > 30W...");
        setAlertType('alert-warning'); // Amarelo
      } 
      else if (status === "GRAVANDO") {
        const pontos = buffer ? buffer.length : 0;
        setProgresso(pontos);
        setStatusTexto(`🔴 Gravando dados... Capturado: ${pontos}/10 pontos`);
        setAlertType('alert-danger'); // Vermelho
      } 
      else if (status === "CONCLUIDO") {
        pararPolling();
        setLoading(false);
        setProgresso(10);
        setStatusTexto(`✅ Sucesso! Aparelho "${nomeAparelho}" foi gravado.`);
        setAlertType('alert-success'); // Verde
        setNomeAparelho(''); // Limpa campo
      } 
      else if (status === "ERRO") {
        pararPolling();
        setLoading(false);
        setStatusTexto(`❌ Erro: ${mensagem}`);
        setAlertType('alert-danger');
      }

    } catch (error) {
      console.error("Erro no polling:", error);
      // Não paramos o polling por erro de rede temporário
    }
  };

  // --- BOTÃO GRAVAR ---
  const handleGravar = async (e) => {
    e.preventDefault();
    if (!nomeAparelho) {
      alert('Por favor, digite um nome para o aparelho.');
      return;
    }

    try {
      setLoading(true);
      setProgresso(0);
      setStatusTexto('Enviando solicitação ao servidor...');
      setAlertType('alert-primary'); // Azul

      // 1. Envia pedido de início (Agora responde rápido com 202 Accepted)
      await api.post('/api/gravar_assinatura', {
        nome_aparelho: nomeAparelho, // Nota: Backend espera 'nome_aparelho'
      });

      setStatusTexto('Solicitação aceita. Iniciando monitoramento...');
      
      // 2. Inicia o loop de perguntas (a cada 2 segundos)
      pararPolling(); 
      intervaloRef.current = setInterval(verificarStatus, 2000);

    } catch (error) {
      setLoading(false);
      console.error('Erro ao iniciar:', error);
      
      if (error.response && error.response.status === 409) {
        setStatusTexto('Já existe uma gravação em andamento. Aguarde.');
        setAlertType('alert-warning');
        // Opcional: Tenta conectar no processo já existente
        intervaloRef.current = setInterval(verificarStatus, 2000);
      } else {
        setStatusTexto('Erro de conexão com o servidor.');
        setAlertType('alert-danger');
      }
    }
  };

  return (
    <div className="p-4 container" style={{ maxWidth: '600px' }}>
      <h3 className="mb-4">Treinar Novo Aparelho</h3>
      
      <form onSubmit={handleGravar}>
        <div className="mb-3">
          <label htmlFor="nomeAparelho" className="form-label">
            Nome do Aparelho:
          </label>
          <input
            type="text"
            className="form-control"
            id="nomeAparelho"
            value={nomeAparelho}
            onChange={handleChange}
            placeholder="Ex: Secador de Cabelo"
            disabled={loading}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Processando...' : 'Gravar Assinatura'}
        </button>
      </form>

      {/* Área de Status */}
      <div className="mt-4">
        <h5>Status:</h5>
        <div className={`alert ${alertType}`} role="alert">
          {statusTexto}
        </div>

        {/* Barra de Progresso (Opcional) */}
        {loading && (
          <div className="progress mt-2">
            <div 
              className="progress-bar progress-bar-striped progress-bar-animated" 
              role="progressbar" 
              style={{ width: `${(progresso / 10) * 100}%` }}
              aria-valuenow={progresso} 
              aria-valuemin="0" 
              aria-valuemax="10"
            >
              {progresso * 10}%
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Treinamento;
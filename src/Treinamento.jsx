import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from './api'; // Importa nossa configuração do Axios

function Treinamento() {
  const [nomeAparelho, setNomeAparelho] = useState('');
  const [status, setStatus] = useState('Ocioso');

  // Atualiza o estado 'nomeAparelho' enquanto o usuário digita
  const handleChange = (e) => {
    setNomeAparelho(e.target.value);
  };

  // Função chamada pelo botão "Gravar"
  const handleGravar = async (e) => {
    e.preventDefault(); // Impede o recarregamento da página
    if (!nomeAparelho) {
      alert('Por favor, digite um nome para o aparelho.');
      return;
    }
    
    setStatus(`Aguardando sinal para "${nomeAparelho}"... (Pode levar até 5 min)`);

    try {
      // Chama a API do backend (app.py) para gravar
      const response = await api.post('/api/gravar_assinatura', {
        nome: nomeAparelho,
      });

      if (response.data.success) {
        setStatus(`Sucesso! Assinatura para "${nomeAparelho}" foi gravada.`);
        console.log('Features gravadas:', response.data.features);
        setNomeAparelho(''); // Limpa o campo após o sucesso
      } else {
        setStatus(`Erro: ${response.data.error}`);
      }
    } catch (error) {
      console.error('Erro ao gravar a assinatura:', error);
      setStatus(`Erro de conexão com o servidor. O 'app.py' está rodando?`);
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleGravar}>
        <div className="mb-3">
          <label htmlFor="nomeAparelho" className="form-label">
            Nome do Aparelho:
          </label>
          <input
            type="text"
            className="form-control"
            id="nomeAparelho"
            name="nomeAparelho"
            value={nomeAparelho}
            onChange={handleChange}
            placeholder="Ex: Geladeira"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Gravar Assinatura
        </button>
      </form>

      {/* Área de Status */}
      {status && (
        <div className="mt-4">
          <h2>Status:</h2>
          <p className="alert alert-info">{status}</p>
        </div>
      )}
    </div>
  );
}

export default Treinamento;
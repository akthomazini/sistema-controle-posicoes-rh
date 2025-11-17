import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [posicoes, setPosicoes] = useState([]);
  const [form, setForm] = useState({ nomeLotacao: '', funcaoExercida: '', orcamento: '' });
  const [editId, setEditId] = useState(null);
  const [busca, setBusca] = useState('');
  const [totais, setTotais] = useState(null);

  // Endereço do seu Backend (Spring Boot)
  const apiUrl = 'http://localhost:8080/controle_posicoes/api/posicoes';

  useEffect(() => {
    carregarPosicoes();
    carregarTotais();
  }, []);

  // --- FUNÇÕES DE COMUNICAÇÃO COM A API ---

  const carregarPosicoes = async () => {
    try {
      const resposta = await axios.get(apiUrl);
      setPosicoes(resposta.data);
    } catch (erro) {
      console.error("Erro ao carregar posições:", erro);
    }
  };

  const carregarTotais = async () => {
    try {
      const resposta = await axios.get(`${apiUrl}/totais`);
      setTotais(resposta.data);
    } catch (erro) {
      console.error("Erro ao carregar totais:", erro);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${apiUrl}/${editId}`, form);
        alert("Posição atualizada com sucesso!");
      } else {
        await axios.post(apiUrl, form);
        alert("Posição cadastrada com sucesso!");
      }
      // Limpa o formulário e recarrega a tabela
      setForm({ nomeLotacao: '', funcaoExercida: '', orcamento: '' });
      setEditId(null);
      carregarPosicoes();
      carregarTotais();
    } catch (erro) {
      alert("Erro ao salvar. Verifique se o Backend está rodando.");
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Tem certeza que deseja excluir esta posição?")) {
      try {
        await axios.delete(`${apiUrl}/${id}`);
        carregarPosicoes();
        carregarTotais();
      } catch (erro) {
        alert("Erro ao excluir.");
      }
    }
  };

  const handleSearch = async () => {
    // Exemplo buscando por Nome da Lotação
    try {
      const resposta = await axios.get(`${apiUrl}/busca?nome=${busca}`);
      setPosicoes(resposta.data);
    } catch (erro) {
      alert("Erro na busca.");
    }
  };

  // --- FUNÇÕES VISUAIS ---

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (posicao) => {
    setEditId(posicao.idLotacao);
    setForm({ 
      nomeLotacao: posicao.nomeLotacao, 
      funcaoExercida: posicao.funcaoExercida, 
      orcamento: posicao.orcamento 
    });
  };

  return (
    <div className="container">
      <h1>Controle de Posições RH</h1>

      {/* Formulário */}
      <div className="card">
        <h2>{editId ? 'Editar Posição' : 'Nova Posição'}</h2>
        <form onSubmit={handleSubmit}>
          <input name="nomeLotacao" placeholder="Lotação (ex: TI, RH)" value={form.nomeLotacao} onChange={handleChange} required />
          <input name="funcaoExercida" placeholder="Função" value={form.funcaoExercida} onChange={handleChange} required />
          <input name="orcamento" type="number" step="0.01" placeholder="Orçamento (R$)" value={form.orcamento} onChange={handleChange} required />
          <div className="btn-group">
            <button type="submit" className="btn-save">{editId ? 'Atualizar' : 'Salvar'}</button>
            {editId && <button type="button" className="btn-cancel" onClick={() => {setEditId(null); setForm({nomeLotacao:'', funcaoExercida:'', orcamento:''})}}>Cancelar</button>}
          </div>
        </form>
      </div>

      {/* Busca */}
      <div className="search-box">
        <input placeholder="Buscar por Nome da Lotação..." value={busca} onChange={(e) => setBusca(e.target.value)} />
        <button onClick={handleSearch}>Pesquisar</button>
        <button className="btn-clear" onClick={() => {setBusca(''); carregarPosicoes();}}>Limpar Busca</button>
      </div>

      {/* Tabela */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Lotação</th>
            <th>Função</th>
            <th>Orçamento</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {posicoes.length === 0 && <tr><td colSpan="5" style={{textAlign: 'center'}}>Nenhuma posição encontrada.</td></tr>}
          {posicoes.map((p) => (
            <tr key={p.idLotacao}>
              <td>{p.idLotacao}</td>
              <td>{p.nomeLotacao}</td>
              <td>{p.funcaoExercida}</td>
              <td>{p.orcamento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
              <td>
                <button className="btn-edit" onClick={() => handleEdit(p)}>Editar</button>
                <button className="btn-delete" onClick={() => handleDelete(p.idLotacao)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totais */}
      {totais && (
        <div className="totais-area">
          <h2>Resumo Orçamentário</h2>
          <div className="totais-grid">
            {Object.keys(totais).map(lotacao => (
              <div key={lotacao} className="total-card">
                <h3>{lotacao}</h3>
                <ul>
                  {Object.keys(totais[lotacao]).map(funcao => (
                    <li key={funcao}>
                      <span>{funcao}:</span> 
                      <strong>{totais[lotacao][funcao].toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

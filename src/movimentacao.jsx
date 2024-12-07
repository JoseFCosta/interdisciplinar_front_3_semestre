import React, { useState, useEffect } from 'react';
import { getMovimentos, createMovimento } from '../services/api';

function Movimentacao() {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [descricao, setDescricao] = useState('');
  const [data, setData] = useState('');
  const [valorDebito, setValorDebito] = useState('');
  const [valorCredito, setValorCredito] = useState('');
  const [verificacaoFinanceiro, setVerificacaoFinanceiro] = useState('indefinido');
  const [verificacaoContabil, setVerificacaoContabil] = useState('indefinido');

  useEffect(() => {
    carregarMovimentacoes();
  }, []);

  const carregarMovimentacoes = async () => {
    try {
      const response = await getMovimentos();
      setMovimentacoes(response.data);
    } catch (error) {
      console.error('Erro ao carregar movimentações:', error);
    }
  };

  const adicionarMovimentacao = async (e) => {
    e.preventDefault();
    const novaMovimentacao = {
      descricao,
      data,
      valorDebito: parseFloat(valorDebito),
      valorCredito: parseFloat(valorCredito),
      verificacaoFinanceiro,
      verificacaoContabil,
    };

    try {
      await createMovimento(novaMovimentacao);
      carregarMovimentacoes();
      setDescricao('');
      setData('');
      setValorDebito('');
      setValorCredito('');
    } catch (error) {
      console.error('Erro ao adicionar movimentação:', error);
    }
  };

  return (
    <div>
      <h2>Movimentações Contábeis</h2>
      <form onSubmit={adicionarMovimentacao}>
        <input
          type="text"
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />
        <input
          type="date"
          placeholder="Data"
          value={data}
          onChange={(e) => setData(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Valor Débito"
          value={valorDebito}
          onChange={(e) => setValorDebito(e.target.value)}
        />
        <input
          type="number"
          placeholder="Valor Crédito"
          value={valorCredito}
          onChange={(e) => setValorCredito(e.target.value)}
        />
        <select value={verificacaoFinanceiro} onChange={(e) => setVerificacaoFinanceiro(e.target.value)}>
          <option value="aprovado">Aprovado</option>
          <option value="negado">Negado</option>
          <option value="indefinido">Indefinido</option>
        </select>
        <select value={verificacaoContabil} onChange={(e) => setVerificacaoContabil(e.target.value)}>
          <option value="aprovado">Aprovado</option>
          <option value="negado">Negado</option>
          <option value="indefinido">Indefinido</option>
        </select>
        <button type="submit">Adicionar Movimentação</button>
      </form>

      <div>
        <h3>Lista de Movimentações</h3>
        <ul>
          {movimentacoes.map((mov) => (
            <li key={mov.idMovimentoContabil}>
              {mov.descricao} - Data: {new Date(mov.data).toLocaleDateString()} - Débito: R${mov.valorDebito} - Crédito: R${mov.valorCredito} - Status Financeiro: {mov.verificacaoFinanceiro} - Status Contábil: {mov.verificacaoContabil}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Movimentacao;

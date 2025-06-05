import React, { useEffect, useState } from 'react';
import MemoForm from './components/MemoForm'; // Componente para o formulário de lembretes
import MemoList from './components/MemoList'; // Componente para a lista de lembretes
import memoService from './services/memoService'; // Serviço para interação com a API de lembretes 
import './App.css';

/**
 * Componente principal da aplicação MemoKeeper.
 */

const App = () => {
  // Estado local para armazenar a lista de memos
  const [memos, setMemos] = useState([]);

   // Função assíncrona para buscar os memos da API e atualizar o estado local
  const fetchMemos = async () => {
    const data = await memoService.getAllMemos();
    setMemos(data);
  };
  // Efeito executado uma vez ao montar o componente para buscar os memos iniciais
  useEffect(() => {
    fetchMemos();
  }, []);
  // Renderização do componente App
  // Componente MemoForm para adicionar novos memos, passando a função fetchMemos como propriedade
  // Componente MemoList para exibir a lista de memos, passando memos e fetchMemos como propriedades
  return (
    <div className="app-container">
      <h1>MemoKeeper</h1>
      <MemoForm fetchMemos={fetchMemos} />
      <MemoList memos={memos} fetchMemos={fetchMemos} />
    </div>
  );
};

export default App;
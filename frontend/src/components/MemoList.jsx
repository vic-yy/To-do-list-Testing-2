import React, { useEffect, useState } from 'react';
import memoService from '../services/memoService';
import '../assets/styles/main.scss';

// Componente funcional MemoList que exibe uma lista de memos
const MemoList = ({ fetchMemos }) => {
  const [memos, setMemos] = useState([]);
  // Efeito que executa ao montar o componente ou quando fetchMemos muda
  useEffect(() => {
    const fetchMemosData = async () => {
      try {
        const data = await memoService.getAllMemos(); // Chama o serviço para buscar os lembretes
        setMemos(data); // Atualiza o estado dos lembretes com os dados obtidos
      } catch (error) {
        console.error('Failed to fetch memos:', error); // Trata erros na busca dos memos
      }
    };

    fetchMemosData(); // Chama a função de busca de memos ao montar o componente

  }, [fetchMemos]);  // Dependência que determina quando o efeito deve ser reexecutado
  // Função para lidar com a exclusão de um memo pelo ID
  const handleDelete = async (id) => {
    try {
      const response = await memoService.deleteMemo(id);

      if (response.status === 204) {
        fetchMemos(); // Atualiza a lista de memos após a exclusão bem-sucedida
      } else {
        console.log('Memo not found or unable to delete.');
      }
    } catch (error) {
      console.error('Failed to delete memo:', error);
    }
  };
  
// Função para atualizar o status de um memo pelo ID
  const handleUpdate = async (id, status) => {
    try {
      const memoToUpdate = memos.find(memo => memo.id === id);
      
      if (!memoToUpdate) {
        console.error(`Memo with ID ${id} not found.`);
        return;
      }

      const newStatus = status === 'pendente' ? 'completado' : 'pendente'; // Alterna o status
      // Validação se o título e status não estão vazios

      if (!memoToUpdate.title.trim() || !newStatus.trim()) {
        setError('Title and status cannot be empty.');
        setShowErrorPopup(true);
        setTimeout(() => {
          setShowErrorPopup(false);
        }, 3000);
        return;
      }

       // Atualiza o memo com o novo status
      const updatedMemo = await memoService.updateMemo(id, { title: memoToUpdate.title, status: newStatus });

      if (updatedMemo) {
      // Atualiza o estado dos memos localmente após a atualização no servidor
        setMemos(prevMemos =>
          prevMemos.map(memo =>
            memo.id === id ? { ...memo, status: newStatus } : memo
          )
        );
      } else {
        console.error(`Failed to update memo with ID ${id}.`);
      }
    } catch (error) {
      console.error('Failed to update memo status:', error);
    }
  };
  
 // Função para agrupar os memos por data de criação
  const groupMemosByDate = (memos) => {
    return memos.reduce((grouped, memo) => {
      const date = memo.created_at;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(memo);
      return grouped;
    }, {});
  };
  const groupedMemos = groupMemosByDate(memos);

  const sortedDates = Object.keys(groupedMemos).sort((a, b) => new Date(b) - new Date(a));

  // Estrutura JSX que renderiza a lista de memos agrupados por data. 
  // A função `sortedDates.map` itera sobre cada data agrupada em `sortedDates`, 
  // renderizando um grupo de memos para cada data. Cada grupo é representado por 
  // um `<div>` com a classe `date-group`, contendo um título `<h3>` com a data e 
  // uma lista `<ul>` de lembretes. Cada lembrete é renderizado como um item `<li>` na 
  // lista, exibindo seu título e status dentro de `<span>`s. Botões dentro de 
  // `<div>` com a classe `buttons` permitem ações como atualizar o status do lembrete
  // e deletá-lo ao clicar. Cada lembrete é identificado pelo seu ID único.

  return (
    <div>
      <h2>Memos List</h2>
      {sortedDates.map((date) => (
        <div key={date} className="date-group">
          <h3>{date}</h3>
          <ul>
            {groupedMemos[date].map((memo) => (
              <li key={memo.id} className="memo-itens">
                <div className='memo-details'>
                  <span className='memo-title'>{memo.title}</span>
                  <span className='memo-status'>{memo.status}</span>
                </div>
                <div className="buttons">
                  <button onClick={() => handleUpdate(memo.id, memo.status)}>Trocar Status</button>
                  <button onClick={() => handleDelete(memo.id)}>Deletar</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default MemoList;
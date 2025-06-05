// MemoList.jsxAdd commentMore actions

import React, { useEffect, useState } from 'react';
import memoService from '../services/memoService';

const MemoList = ({ fetchMemos }) => {
  const [memos, setMemos] = useState([]);

  useEffect(() => {
    const fetchMemos = async () => {
      try {
        const data = await memoService.getAllMemos();
        setMemos(data);
      } catch (error) {
        console.error('Failed to fetch memos:', error);
      }
    };

    fetchMemos();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await memoService.deleteMemo(id);
      if (response.status === 204) {
        // Exclusão bem-sucedida, atualiza a lista de memos
        fetchMemos();
      } else {
        console.log('Memo not found or unable to delete.');
      }
    } catch (error) {
      console.error('Failed to delete memo:', error);
    }
  };
  

  const handleUpdate = async (id, status) => {
    const newStatus = status === 'pendente' ? 'completado' : 'pendente';
    await memoService.updateMemo(id, { status: newStatus });
    fetchMemos();
  };

  return (
    <div>
      <h2>Memos List</h2>
      <ul>
        {memos.map((memo) => (
          <li key={memo.id}>
            <span>{memo.title} - {memo.status}</span>
            <button onClick={() => handleUpdate(memo.id, memo.status)}>Toggle Status</button>
            <button onClick={() => handleDelete(memo.id)}>Delete</button>Add commentMore actions
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MemoList;
import React, { useState } from 'react';
import memoService from '../services/memoService';

const MemoForm = ({ fetchMemos }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await memoService.createMemo({ title });
      setTitle(''); // Limpa o campo do título após a criação
      fetchMemos(); // Atualiza a lista de memos após a criação
    } catch (error) {
      console.error('Failed to create memo:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="json"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter memo title"
        required
      />
      <button type="submit">Add Memo</button>
    </form>
  );
};

export default MemoForm;
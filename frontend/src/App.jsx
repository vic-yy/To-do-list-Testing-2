import React, { useEffect, useState } from 'react';
import MemoForm from './components/MemoForm';
import MemoList from './components/MemoList';
import memoService from './services/memoService';

const App = () => {
  const [memos, setMemos] = useState([]);

  const fetchMemos = async () => {
    const data = await memoService.getAllMemos();
    setMemos(data);
    console.log(data);
  };

  useEffect(() => {
    fetchMemos();
  }, []);

  return (
    <div>
      <h1>Memos</h1>
      <MemoForm fetchMemos={fetchMemos} />
      <MemoList memos={memos} fetchMemos={fetchMemos} />
    </div>
  );
};

export default App;
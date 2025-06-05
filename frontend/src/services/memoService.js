import axios from 'axios';

const baseURL = 'http://localhost:3333/memos-simulado';

const getAllMemos = async () => {
    try {
      const response = await axios.get(`${baseURL}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch memos');
    }
  };

const createMemo = async (memo) => {
  const response = await axios.post(baseURL, memo);
  return response.data;
};

const deleteMemo = async (id) => {
    try {
      const response = await axios.delete(`${baseURL}/${id}`);
      return response;
    } catch (error) {
      throw error; // Propaga o erro para que ele possa ser tratado no componente que chama deleteMemo
    }
  };


const updateMemo = async (id, memo) => {
  await axios.put(`${baseURL}/${id}`, memo);
};

export default {
  getAllMemos,
  createMemo,
  deleteMemo,
  updateMemo,
};
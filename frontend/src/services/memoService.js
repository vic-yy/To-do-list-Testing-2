import axios from 'axios';

const baseURL = 'http://localhost:3333/api/memos';

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
      throw error; 
    }
  };


  const updateMemo = async (id, memo) => {
    try {
      const response = await axios.put(`${baseURL}/${id}`, memo);
      return response.data; // Retorna os dados atualizados, se necessário
    } catch (error) {
      if (error.response) {
        // O servidor retornou um status de erro (400, 500, etc.)
        console.error('Server Error:', error.response.data);
      } else if (error.request) {
        // A requisição foi feita, mas não houve resposta do servidor
        console.error('No response from server:', error.request);
      } else {
        // Ocorreu um erro durante a configuração da requisição
        console.error('Request error:', error.message);
      }
      throw error; // Propaga o erro para quem chamou essa função, para que possa ser tratado adequadamente
    }
  };
  

export default {
  getAllMemos,
  createMemo,
  deleteMemo,
  updateMemo,
};
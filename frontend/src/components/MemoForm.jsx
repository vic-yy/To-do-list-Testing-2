/**
 * Componente MemoForm para adicionar novos lembretes.
 * Utiliza useState para gerenciar o estado de título (title),
 * data de criação (createdAt), erros (error) e exibição do popup de erro (showErrorPopup).
 * Recebe a função fetchMemos como propriedade para atualizar a lista de lembretes após adicionar um novo.
 */

import React, { useState } from 'react';
import memoService from '../services/memoService';
import '../assets/styles/main.scss';


// Define quatro estados locais usando o hook useState
const MemoForm = ({ fetchMemos }) => {
  const [title, setTitle] = useState(''); // Estado para armazenar o título 
  const [createdAt, setCreatedAt] = useState(''); // Estado para armazenar a data 
  const [error, setError] = useState(''); // Estado para armazenar a mensagem de erro
  const [showErrorPopup, setShowErrorPopup] = useState(false); // Estado para controlar a exibição do popup de erro
// Função para lidar com o envio do formulário de criação de lembretes
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previne o comportamento padrão de recarregar a página ao enviar o formulário
  // Expressão regular para validar o formato da data (dd/mm/aaaa)
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (createdAt && !dateRegex.test(createdAt)) { // Verifica se a data foi fornecida e se está no formato correto
      setError('Formato de data inválido.\nUse dd/mm/aaaa.');
      setShowErrorPopup(true); // Exibe o popup de erro
      setTimeout(() => {
        setShowErrorPopup(false);
      }, 3000);
      return;
    }
// Verifica se a data foi fornecida e divide a data fornecida em dia, mês e ano
    if (createdAt) {
      const [day, month, year] = createdAt.split('/').map(Number);
 // Verifica se o mês fornecido é válido e dá uma mensagem de erro caso contrário
      if (month < 1 || month > 12) {
        setError('Mês inválido.');
        setShowErrorPopup(true);
        setTimeout(() => {
          setShowErrorPopup(false);
        }, 3000);
        return;
      }

// Verifica se o dia fornecido é válido e dá uma mensagem de erro caso contrário
      const daysInMonth = new Date(year, month, 0).getDate();
      if (day < 1 || day > daysInMonth) {
        setError('Dia inválido para o mês especificado.');
        setShowErrorPopup(true);
        setTimeout(() => {
          setShowErrorPopup(false);
        }, 3000);
        return;
      }
    // Converte a data fornecida para um objeto Date e verifica se não é uma data no passado
      const inputDate = new Date(year, month - 1, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (inputDate < today) {
        setError('A data não pode estar no passado.');
        setShowErrorPopup(true);
        setTimeout(() => {
          setShowErrorPopup(false);
        }, 3000);
        return;
      }
    }

    try {
      // Chama o serviço para criar um novo memo com o título e data fornecidos
      await memoService.createMemo({ title, created_at: createdAt });
      setTitle(''); // Limpa o campo de título após a criação bem-sucedida
      setCreatedAt(''); // Limpa o campo de data após a criação bem-sucedida
      setError(''); // Limpa mensagens de erro após a criação bem-sucedida
      fetchMemos(); // Atualiza a lista de memos chamando a função fetchMemos fornecida
    } catch (error) {
      console.error('Failed to create memo:', error); // Log de erro caso falhe ao criar o memo
    }
  };

    // Renderização do formulário de memo
  return (
    <form onSubmit={handleSubmit} className='memo-form'>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Adicione o lembrete"
        required
        className="memo-input"
      />
      <input
        type="text"
        value={createdAt}
        onChange={(e) => setCreatedAt(e.target.value)}
        placeholder="dd/mm/aaaa"
        className="date-input"
      />
      <button type="submit" className="memo-submit">Adicionar</button>
      {showErrorPopup && (
        <div className="error-popup">
          <p className="error-message">{error}</p>
        </div>
      )}
    </form>
  );
};

export default MemoForm;
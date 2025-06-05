const connection = require('./connection');

// Lista de lembretes simulados em memória
const lista = [];


// Formata a data atual no formato brasileiro padrão
const formattedDate = new Date(Date.now()).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });


/**
 * Função para criar um novo lembrete simulado.
 * @param {Object} memo - Objeto contendo o título e data de criação do memo.
 * @returns {Promise<Object>} Objeto do memo criado.
 */

  const createMemoSimulado = async (memo) => {
    const { title, created_at } = memo;
    const formattedDate = created_at || new Date(Date.now()).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
    const newMemo = { id: lista.length + 1, title, status: 'pendente', created_at: formattedDate };
    lista.push(newMemo);
    return newMemo;
}

/**
 * Retorna todos os lembretes simulados.
 * @returns {Promise<Array>} Array contendo todos os lembretes simulados.
 */
const getAllSimulado = async () => {
    return lista;
}


/**
 * Deleta um lembrete simulado conforme seu ID.
 * @param {number|string} id - ID do lembrete a ser deletado.
 * @returns {Promise<boolean>} true se o lembrete foi deletado com sucesso, false caso contrário.
 */
const deleteMemoSimulado = async (id) => {
    const numericId = parseInt(id, 10);
    const index = lista.findIndex((memo) => memo.id === numericId);
    if (index === -1) return false;
    lista.splice(index, 1);
    return true;
}


/**
 * Atualiza um memo simulado conforme seu ID.
 * @param {number|string} id - ID do memo a ser atualizado.
 * @param {Object} memo - Objeto contendo os campos a serem atualizados no memo.
 * @returns {Promise<Object|boolean>} Objeto do memo atualizado se sucesso, false se não encontrado.
 */
const updateMemoSimulado = async (id, memo) => {
    const numericId = parseInt(id, 10);
    const index = lista.findIndex((memo) => memo.id === numericId);

    if (index === -1) return false;

    lista[index] = { ...lista[index], ...memo };
    return lista[index]; // Retorna o memo atualizado
}


module.exports = {
    createMemoSimulado,
    getAllSimulado,
    deleteMemoSimulado,
    updateMemoSimulado,
    lista
};
const memoModel = require('../models/memoModel');

const createMemoSimulado = async (request, response) => {
    const newMemo = await memoModel.createMemoSimulado(request.body);
    return response.status(201).json(newMemo);
}

const getAllSimulado = async (_request, response) => {
    const memos = await memoModel.getAllSimulado();
    return response.status(200).json(memos);
}

const deleteMemoSimulado = async (request, response) => {
    const { id } = request.params;
    const deleted = await memoModel.deleteMemoSimulado(id);
    if (!deleted) return response.status(404).json({ message: 'Memo not found' });
    resposta = response.status(204).send();
    return resposta;
}

const updateMemoSimulado = async (request, response) => {
    const { id } = request.params;
    const updatedMemo = await memoModel.updateMemoSimulado(id, request.body);
    if (!updatedMemo) return response.status(400).json({ message: 'Memo not found' });
    return response.status(200).json(updatedMemo);
}

const getMemoById = async (request, response) => {
    const { id } = request.params;
    const memo = await memoModel.getMemoById(id); // Método a ser implementado no memoModel
    if (!memo) return response.status(404).json({ message: 'Memo not found' });
    return response.status(200).json(memo);
}

module.exports = {
    createMemoSimulado,
    getAllSimulado,
    getMemoById,
    deleteMemoSimulado,
    updateMemoSimulado
};
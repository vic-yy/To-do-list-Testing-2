const {
  createMemoSimulado,
  getAllSimulado,
  deleteMemoSimulado,
  updateMemoSimulado,
  lista
} = require('../models/memoModel');

describe('memoModel (simulado)', () => {
  beforeEach(() => {
    lista.length = 0;
  });

  test('createMemoSimulado deve adicionar memo à lista', async () => {
    const memo = await createMemoSimulado({ title: 'Estudar Jest' });

    expect(memo.id).toBe(1);
    expect(memo.title).toBe('Estudar Jest');
    expect(memo.status).toBe('pendente');
    expect(lista).toHaveLength(1);
  });

  test('getAllSimulado deve retornar todos os memos', async () => {
    await createMemoSimulado({ title: '1' });
    await createMemoSimulado({ title: '2' });

    const all = await getAllSimulado();
    expect(all).toHaveLength(2);
    expect(all[1].title).toBe('2');
  });

  test('deleteMemoSimulado deve deletar memo existente', async () => {
    await createMemoSimulado({ title: 'teste' });

    const result = await deleteMemoSimulado(1);
    expect(result).toBe(true);
    expect(lista).toHaveLength(0);
  });

  test('deleteMemoSimulado deve retornar false se memo não existir', async () => {
    const result = await deleteMemoSimulado(99);
    expect(result).toBe(false);
  });

  test('updateMemoSimulado deve atualizar memo existente', async () => {
    await createMemoSimulado({ title: 'Velho' });

    const updated = await updateMemoSimulado(1, { title: 'Novo', status: 'feito' });
    expect(updated.title).toBe('Novo');
    expect(updated.status).toBe('feito');
  });

  test('updateMemoSimulado deve retornar false se memo não existir', async () => {
    const updated = await updateMemoSimulado(42, { title: 'Nada' });
    expect(updated).toBe(false);
  });
});
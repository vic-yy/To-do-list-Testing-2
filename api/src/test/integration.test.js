const request = require('supertest');
const app = require('../app');
const { lista } = require('../models/memoModel');
const {
  createMemoSimulado,
  getAllSimulado,
  deleteMemoSimulado,
  updateMemoSimulado
} = require('../models/memoModel');
const { validateFieldTitle, validateFieldStatus } = require('../middlewares/memosMiddleware');

describe('Memo API (Simulado)', () => {
  beforeEach(() => {
    lista.length = 0; 
  });

  describe('POST /api/memos', () => {
    it('should create a new memo and return 201', async () => {
      const res = await request(app)
        .post('/api/memos')
        .send({ title: 'Aprender Testes' });

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual(
        expect.objectContaining({
          id: 1,
          title: 'Aprender Testes',
          status: 'pendente',
          created_at: expect.any(String),
        })
      );
    });

    it('should return 400 if title is empty', async () => {
      const res = await request(app)
        .post('/api/memos')
        .send({ title: '' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ message: 'The field "title" cannot be empty.' });
    });

    it('should accept a long title', async () => {
      const longTitle = 'A'.repeat(1000);  // Uma string longa com 1000 caracteres

      const res = await request(app)
        .post('/api/memos')
        .send({ title: longTitle });

      expect(res.statusCode).toBe(201);
      expect(res.body.title).toBe(longTitle);
    });

    it('should create a memo and set created_at to the current date if not provided', async () => {
      const res = await request(app)
        .post('/api/memos')
        .send({ title: 'Memo Sem Data' });

      expect(res.statusCode).toBe(201);
      expect(res.body.created_at).toBeDefined();
      expect(res.body.created_at).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    });
  });

  describe('GET /api/memos', () => {
    it('should return all memos with 200', async () => {
      await request(app).post('/api/memos').send({ title: 'Memo 1' });
      await request(app).post('/api/memos').send({ title: 'Memo 2' });

      const res = await request(app).get('/api/memos');

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(2);
    });

    it('should return an empty array if no memos exist', async () => {
      const res = await request(app).get('/api/memos');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe('DELETE /api/memos/:id', () => {
    it('should delete a memo and return 204', async () => {
      await request(app).post('/api/memos').send({ title: 'Para deletar' });

      const res = await request(app).delete('/api/memos/1');

      expect(res.statusCode).toBe(204);
    });

    it('should return 404 if memo not found', async () => {
      const res = await request(app).delete('/api/memos/999');

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ message: 'Memo not found' });
    });

    it('should delete all memos and return 204', async () => {
      await request(app).post('/api/memos').send({ title: 'Memo 1' });
      await request(app).post('/api/memos').send({ title: 'Memo 2' });

      const res1 = await request(app).delete('/api/memos/1');
      expect(res1.statusCode).toBe(204);

      const res2 = await request(app).delete('/api/memos/2');
      expect(res2.statusCode).toBe(204);

      const res = await request(app).get('/api/memos');
      expect(res.body).toEqual([]);
    });
  });

  describe('PUT /api/memos/:id', () => {
    it('should update a memo and return 200', async () => {
      await request(app).post('/api/memos').send({ title: 'Original' });

      const res = await request(app)
        .put('/api/memos/1')
        .send({ title: 'Atualizado', status: 'feito' });

      expect(res.statusCode).toBe(200);
      expect(res.body.title).toBe('Atualizado');
      expect(res.body.status).toBe('feito');
    });

    it('should return 400 if memo to update is not found', async () => {
      const res = await request(app)
        .put('/api/memos/999')
        .send({ title: 'Nada' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ message: 'The field "status" is mandatory.' });
    });

    it('should return 400 if status is missing when updating a memo', async () => {
      await request(app).post('/api/memos').send({ title: 'Atualizar Sem Status' });

      const res = await request(app)
        .put('/api/memos/1')
        .send({ title: 'Novo Título' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ message: 'The field "status" is mandatory.' });
    });

    it('should return 400 if the status provided is invalid', async () => {
      await request(app).post('/api/memos').send({ title: 'Memo para Atualizar' });

      const res = await request(app)
        .put('/api/memos/1')
        .send({ status: 'invalidStatus' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ message: 'The field \"title\" cannot be empty.' });
    });
  });

  describe('Middleware: validateFieldTitle', () => {
    const mockResponse = () => {
      const res = {};
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      return res;
    };

    it('should return 400 if title is empty string', () => {
      const req = { body: { title: '' } };
      const res = mockResponse();
      const next = jest.fn();

      validateFieldTitle(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'The field "title" cannot be empty.' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next if title is valid', () => {
      const req = { body: { title: 'Valid title' } };
      const res = mockResponse();
      const next = jest.fn();

      validateFieldTitle(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('Middleware: validateFieldStatus', () => {
    const mockResponse = () => {
      const res = {};
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      return res;
    };

    it('should return 400 if status is empty string', () => {
      const req = { body: { status: '' } };
      const res = mockResponse();
      const next = jest.fn();

      validateFieldStatus(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'The field "status" cannot be empty.' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next if status is valid', () => {
      const req = { body: { status: 'pendente' } };
      const res = mockResponse();
      const next = jest.fn();

      validateFieldStatus(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});

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

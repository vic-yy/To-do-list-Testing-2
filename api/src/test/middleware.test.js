const { validateFieldTitle, validateFieldStatus } = require('../middlewares/memosMiddleware');

describe('Middleware: validateFieldTitle', () => {
  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  it('should return 400 if title is undefined', () => {
    const req = { body: {} };
    const res = mockResponse();
    const next = jest.fn();

    validateFieldTitle(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'The field \"title\" cannot be empty.' });
    expect(next).not.toHaveBeenCalled();
  });

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

  it('should return 400 if status is undefined', () => {
    const req = { body: {} };
    const res = mockResponse();
    const next = jest.fn();

    validateFieldStatus(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'The field "status" is mandatory.' });
    expect(next).not.toHaveBeenCalled();
  });

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

/**
 * Middleware para validar o campo "title" na requisição.
 * Retorna um erro 400 se o campo "title" não estiver presente ou estiver vazio.
*/
const validateFieldTitle = (request, response, next) => {
    const { body } = request;

    if (body.title === undefined) {
        return response.status(400).json({ message: 'The field "title" is mandatory.' });
    }
    if (body.title === '') {
        return response.status(400).json({ message: 'The field "title" cannot be empty.' });
    }

    // Se todas as validações passarem, o next() continua com o próximo middleware ou rota.
    next();
};

/**
 * Middleware para validar o campo "status" na requisição.
 * Retorna um erro 400 se o campo "status" não estiver presente ou estiver vazio.
*/

const validateFieldStatus = (request, response, next) => {
    const { body } = request;
    
    if (body.status === undefined) {
        return response.status(400).json({ message: 'The field "status" is mandatory.' });
    }
    if (body.status === '') {
        return response.status(400).json({ message: 'The field "status" cannot be empty.' });
    }

    
    next();
};

module.exports = {
    validateFieldTitle,
    validateFieldStatus,
};
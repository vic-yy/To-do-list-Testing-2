const express = require('express');
const router = require('./router');
const cors = require('cors');

const app = express();
// Habilita o CORS para permitir requisições de diferentes origens
app.use(cors());

// Configura o Express para interpretar requisições JSON
app.use(express.json());

// Utiliza o roteador definido no arquivo 'router' para todas as rotas
app.use(router);


module.exports = app;
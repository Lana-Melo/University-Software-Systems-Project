// -----
// routes/userRoutes.js
// -----

// Para programar as rotas e operações da API.
const express = require('express');

// Para aceder às funções com a lógica de resposta
// a pedidos da API relativos a utilizadores.
const userController = require('../controllers/userController');

// -----

// Para agrupar as rotas sobre utilizadores de forma lógica.
const router = express.Router();

// Rota para o registo de um novo utilizador.
router.post('/', userController.create);

// Rota para a remoção de um utilizador a partir do seu ID de MongoDB.
router.delete('/:id', userController.delete);

// Rota para o login de um utilizador.
router.post('/login', userController.login);

module.exports = router;

// -----
// -----
// routes/userRoutes.js
// -----

// Para programar as rotas e operações da API.
const express = require('express');

// Para aceder às funções com a lógica de resposta
// a pedidos da API relativos a pets.
const petController = require('../controllers/petController');

// -----

// Para agrupar as rotas sobre pets de forma lógica.
const router = express.Router();

// Rota para o registo de um novo pet.
router.post('/', petController.create);

// Rota para obter a lista de todos os pets.
router.get('/', petController.getAll);

// Rota para obter um pet pelo seu id.
router.get('/:id', petController.getById);

// Rota para deletar um pet pelo seu id.
router.delete('/:id', petController.delete);

module.exports = router;

// -----
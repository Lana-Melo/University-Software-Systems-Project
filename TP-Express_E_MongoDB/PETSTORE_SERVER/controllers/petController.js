// -----
// controllers/petController.js
// -----

// Para usar o modelo de pet definido em Mongoose.
const Pet = require('../models/petModel');

// Para cifrar dados, em particular senhas de utilizadores.
const bcrypt = require('bcrypt');

// Para gerir tokens válidos durante sessões de uso da API.
const jwt = require('jsonwebtoken');

// -----

// Valor de salt rounds para uso no bcrypt.
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);

// Chave usada na geração de JSON Web Tokens.
const JWT_SECRET = process.env.JWT_SECRET;

// Validade de um JSON Web Token.
const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION;

// -----

// Funções com a lógica de resposta a pedidos da API relativos
// a pets. Todas estas funções têm dois parâmetros:
//  - req: dá acesso aos dados do pedido; e
//  - res: permite compor a resposta ao cliente.

// -----

// Registo de um novo pet.
exports.create = async (req, res) => {
    try {
        // Dados do novo pet vêm no corpo do pedido.
        const{ name, category, photoUrls, tags, status} = req.body;

        // Não vou fazer verificação pq acredito que podem
        // dois pets com mesmo nome        

        // Cria novo objeto Pet com os dados do request
        const newPet = new Pet({
            name: name,
            category: category,
            photoUrls: photoUrls,
            tags: tags,
            status: status
        });
    
        // Se não for possível gravar os dados do pet,
        // o processamento passa para o bloco catch da função.
        await newPet.save()
        
        // 200 = Successful operation.
        res.status(200).json({
        success: true,
        message: 'Pet registado com sucesso.',
            pet: {        id: newPet.id,            name: newPet.name, 
                    category: newPet.category, photoUrls: newPet.photoUrls,
                        tags: newPet.tags,        status: newPet.status 
                 }
                    
        });

    } catch (error) {
        // 500 = Internal server error.
        res.status(500).json({
            success: false, 
            message: 'Erro do servidor durante o registo de um pet.'
        });

        // O que terá acontecido?
        console.error(error);
    }
}

exports.getAll = async (req, res) => {
    try {
        // Se a busca pelos pets não funcionar,
        // o processamento passa para o bloco catch da função.

        // Usa o model Pet para interagir com a DB
        // e selecionar todos os pets registados.
        const pets = await Pet.find();

        //200 = OK.
        res.status(200).json({
            success: true,
            message: 'Lista de todos os Pets resgatada com sucesso.',
            pets: pets
        });
    } catch (error) {
        // 500 = Internal server error.
        res.status(500).json({
        success: false, 
        message: 'Erro do servidor durante a busca pelos pets.'
        });
    }
}

exports.getById = async (req, res) => {
    try {
        const id = req.params.id;
        const pet = await Pet.findById(id);

        // 200 = OK
        res.status(200).json({
            success: true,
            message: 'Pet encontrado com sucesso',
            pet: {       id: pet.id,            name: pet.name,
                   category: pet.category, photoUrls: pet.photoUrls,
                       tags: pet.tags,        status: pet.status
                 }
        })

    } catch (error) {
        // 500 = Internal server error.
        res.status(500).json({
        success: false, 
        message: 'Erro do servidor durante a busca pelo pet.'
        });
    }
}
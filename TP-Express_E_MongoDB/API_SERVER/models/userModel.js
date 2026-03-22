// -----
// models/userModel.js
// -----

// Para interagir com a base de dados MongoDB.
const mongoose = require('mongoose');

// -----

// Esquema que representa um utilizador.
const userSchema = new mongoose.Schema({

  // Campos obrigatórios.

  username: {
    type:     String,
    required: true,
    unique:   true,
    trim:     true
  },

  email: {
    type:      String,
    required:  true,
    unique:    true,
    trim:      true,
    lowercase: true
  },

  password: {
    type:     String,
    required: true
  },

  name: {
    type:     String,
    required: true
  },

  // Campos opcionais.

  mobile: {
    type: Number,
    min:  100000000,
    max:  999999999
  },

  address: String
},

// Adiciona campos createdAt e updatedAt ao esquema.
{ timestamps: true });

// Modelo de utilizador para manipular
// documentos numa coleção do MongoDB.
module.exports = mongoose.model('User', userSchema);

// -----
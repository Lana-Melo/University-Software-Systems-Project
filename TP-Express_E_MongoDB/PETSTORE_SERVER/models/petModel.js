// -----
// models/petModel.js
// -----

// Para interagir com a base de dados MongoDB.
const mongoose = require('mongoose');

// -----

// Esquema que representa uma categoria de pet.
const categorySchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true
    }
})

// Esquema que representa uma tag de pet.
const tagSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true
    }
})

// Esquema que representa um pet.
const petSchema = new mongoose.Schema({

  // Campos obrigatórios.
  name: {
    type: String,
    required: true,
    trim: true
  },

  photoUrls: {
    type: [String],
    required: true
  },

  // Campos opcionais.
  category: { 
    type: categorySchema,
  },

  tags: {
    type: [tagSchema]
  },

  status: {
    type: String, 
    enum: ['available','pending','sold']
  },
},

// Adiciona campos createdAt e updatedAt ao esquema.
{ timestamps: true });

// Modelo de utilizador para manipular
// documentos numa coleção do MongoDB.
module.exports = mongoose.model('Pet', petSchema);

// -----
const mongoose = require('mongoose');

// Schema para Lojas
const lojaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true
  },
  endereco: {
    type: String,
    required: true,
    trim: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  telefone: {
    type: String,
    required: true,
    trim: true
  },
  ativo: {
    type: Boolean,
    default: true
  },
  criadoEm: {
    type: Date,
    default: Date.now
  }
});

// Schema para Estoque
const estoqueSchema = new mongoose.Schema({
  lojaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loja',
    required: true
  },
  loja: {
    type: String,
    required: true
  },
  produto: {
    type: String,
    required: true,
    trim: true
  },
  quantidade: {
    type: Number,
    required: true,
    min: 0
  },
  minimo: {
    type: Number,
    required: true,
    min: 0
  },
  ativo: {
    type: Boolean,
    default: true
  },
  criadoEm: {
    type: Date,
    default: Date.now
  }
});

const Loja = mongoose.model('Loja', lojaSchema);
const Estoque = mongoose.model('Estoque', estoqueSchema);

module.exports = { Loja, Estoque };

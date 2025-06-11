const mongoose = require('mongoose');

const TermoSchema = new mongoose.Schema({
  titulo: String,
  conteudo: String,
  ultimaAtualizacao: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Termos', TermoSchema);
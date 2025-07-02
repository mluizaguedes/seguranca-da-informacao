const mongoose = require('mongoose');

const itemTermoSchema = new mongoose.Schema({
  id: { type: String, required: true }, 
  titulo: { type: String, required: true },
  descricao: { type: String, required: true },
  tipo: { type: String, enum: ['optIn', 'optOut', 'obrigatorio'], required: true },
}, { _id: false });

const termoVersaoSchema = new mongoose.Schema({
  versao: { type: String, required: true, unique: true },
  criadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  publicadoEm: { type: Date, default: Date.now },
  termos: [itemTermoSchema]
});

module.exports = mongoose.model('TermoVersao', termoVersaoSchema);

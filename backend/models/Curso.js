const mongoose = require('mongoose');

const cursoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  modalidade: { type: String, required: true },
  turno: { type: String, required: true },
  duracao: { type: String, required: true },
  totalAlunos: { type: Number, default: 0 },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Curso', cursoSchema);
const mongoose = require('mongoose');

const telefoneSchema = new mongoose.Schema({
  numero: { type: String, required: true }
}, { _id: false });

const contatoEmergenciaSchema = new mongoose.Schema({
  nome: { type: String, required: false },
  telefone: { type: String, required: false }
}, { _id: false });

const userSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  dataNascimento: { type: Date },
  sexo: { type: String, enum: ['', 'Homem cisgênero', 'Mulher cisgênero', 'Homem transgênero', 'Mulher transgênero', 'Outro/Prefiro não dizer'] },
  curso: { type: mongoose.Schema.Types.ObjectId, ref: 'Curso' },
  telefones: [telefoneSchema],
  contatoEmergencia: contatoEmergenciaSchema,
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String },
  rele: { type: String, default: 'usuario' },

  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },

  dataNascimento: { type: Date },
  cpf: { type: String },
  curso: { type: String },
  telefones: [{ type: String }],

  optInNews: { type: Boolean, default: false },
  optInShare: { type: Boolean, default: false },
  cookies: {
    essential: { type: Boolean, default: true },
    preferences: { type: Boolean, default: false },
    analytics: { type: Boolean, default: false },
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
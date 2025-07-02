const mongoose = require('mongoose');

const consentimentoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  versao: { type: String, required: true },
  respostas: {
    type: Map,
    of: Boolean,
    default: () => new Map()
  },
  isCurrent: { type: Boolean, default: true },
  aceitoEm: { type: Date, default: Date.now },
  revogadoEm: Date,
  revogadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Consentimento', consentimentoSchema);

const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  acao: String, // Ex: "CONSENTIMENTO_ATUALIZADO"
  detalhes: mongoose.Schema.Types.Mixed, // Pode guardar qualquer conteúdo
  data: { type: Date, default: Date.now },
  origem: String // "web", "api", etc
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
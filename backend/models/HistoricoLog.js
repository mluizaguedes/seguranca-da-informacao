const mongoose = require("mongoose");

const historicoLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  acao: String, 
  detalhes: mongoose.Schema.Types.Mixed, 
  data: { type: Date, default: Date.now },
  origem: String, 
});

module.exports = mongoose.model("HistoricoLog", historicoLogSchema);

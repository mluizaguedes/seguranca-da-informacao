const mongoose = require('mongoose');

const consentimentoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  consentimento: {
    essential: Boolean,
    preferences: Boolean,
    analytics: Boolean
  },
  data: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Consentimento', consentimentoSchema);
const mongoose = require('mongoose');

const consentimentoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  
  consentimento: {
    optInNews: Boolean,
    optInShare: Boolean,
    optInTerms: { type: Boolean, required: true },
    cookies: {
      essential: { type: Boolean, required: true },
      preferences: Boolean,
      analytics: Boolean,
    },
    isCurrent: { type: Boolean, default: true }
  },

  data: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Consentimento', consentimentoSchema);
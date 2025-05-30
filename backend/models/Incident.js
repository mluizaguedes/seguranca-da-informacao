const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  email: String,
  sentAt: Date
}, { _id: false });

const incidentSchema = new mongoose.Schema({
  description: String,
  timestamp: { type: Date, default: Date.now },
  notifications: [notificationSchema]
});

module.exports = mongoose.model('Incident', incidentSchema);

const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  entity: { type: String, required: true },
  entityId: { type: mongoose.Schema.Types.ObjectId },
  details: { type: mongoose.Schema.Types.Mixed },
  ipAddress: { type: String },
  userAgent: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', activityLogSchema);

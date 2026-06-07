const ActivityLog = require('../models/ActivityLog');

const logActivity = async (req, action, entity, entityId = null, details = null) => {
  try {
    await ActivityLog.create({
      user: req.user?._id,
      action,
      entity,
      entityId,
      details,
      ipAddress: req.ip || req.connection?.remoteAddress,
      userAgent: req.headers['user-agent']
    });
  } catch (err) {
    console.error('Activity log error:', err.message);
  }
};

module.exports = logActivity;

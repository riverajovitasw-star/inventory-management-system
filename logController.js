const ActivityLog = require('../models/ActivityLog');

exports.getLogs = async (req, res, next) => {
  try {
    const { userId, entity, action, page = 1, limit = 50 } = req.query;
    const query = {};
    if (userId) query.user = userId;
    if (entity) query.entity = entity;
    if (action) query.action = { $regex: action, $options: 'i' };

    const total = await ActivityLog.countDocuments(query);
    const logs = await ActivityLog.find(query)
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      data: logs,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

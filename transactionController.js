const Transaction = require('../models/Transaction');

exports.getTransactions = async (req, res, next) => {
  try {
    const { type, productId, startDate, endDate, page = 1, limit = 20 } = req.query;
    const query = {};

    if (type) query.type = type;
    if (productId) query.product = productId;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate + 'T23:59:59.999Z');
    }

    const total = await Transaction.countDocuments(query);
    const transactions = await Transaction.find(query)
      .populate('product', 'name sku category unit')
      .populate('performedBy', 'name email role')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      data: transactions,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit), limit: Number(limit) }
    });
  } catch (error) {
    next(error);
  }
};

exports.getTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('product', 'name sku category')
      .populate('performedBy', 'name email');
    if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found' });
    res.json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

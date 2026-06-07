const Product = require('../models/Product');
const Transaction = require('../models/Transaction');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const [totalProducts, activeProducts, lowStockProducts, outOfStockProducts] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Product.countDocuments({ $expr: { $and: [{ $lte: ['$currentStock', '$minStockLevel'] }, { $gt: ['$currentStock', 0] }] } }),
      Product.countDocuments({ currentStock: 0 })
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thirtyDaysAgo = new Date(today); thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sevenDaysAgo = new Date(today); sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [todayTx, weekTx, monthTx] = await Promise.all([
      Transaction.find({ createdAt: { $gte: today } }),
      Transaction.find({ createdAt: { $gte: sevenDaysAgo } }),
      Transaction.find({ createdAt: { $gte: thirtyDaysAgo } })
    ]);

    const totalStockValue = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, total: { $sum: { $multiply: ['$currentStock', '$costPrice'] } } } }
    ]);

    const monthlyRevenue = monthTx
      .filter(t => t.type === 'stock_out')
      .reduce((sum, t) => sum + (t.totalValue || 0), 0);

    res.json({
      success: true,
      data: {
        products: { total: totalProducts, active: activeProducts, lowStock: lowStockProducts, outOfStock: outOfStockProducts },
        transactions: {
          today: todayTx.length,
          week: weekTx.length,
          month: monthTx.length,
          todayIn: todayTx.filter(t => t.type === 'stock_in').length,
          todayOut: todayTx.filter(t => t.type === 'stock_out').length
        },
        inventory: { totalValue: totalStockValue[0]?.total || 0, monthlyRevenue }
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getStockMovement = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Number(days));

    const movements = await Transaction.aggregate([
      { $match: { createdAt: { $gte: startDate }, type: { $in: ['stock_in', 'stock_out'] } } },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            type: '$type'
          },
          count: { $sum: 1 },
          totalQty: { $sum: '$quantity' },
          totalValue: { $sum: '$totalValue' }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);

    // Reshape data by date
    const dateMap = {};
    movements.forEach(m => {
      if (!dateMap[m._id.date]) dateMap[m._id.date] = { date: m._id.date, stock_in: 0, stock_out: 0, valueIn: 0, valueOut: 0 };
      dateMap[m._id.date][m._id.type] = m.totalQty;
      if (m._id.type === 'stock_in') dateMap[m._id.date].valueIn = m.totalValue;
      if (m._id.type === 'stock_out') dateMap[m._id.date].valueOut = m.totalValue;
    });

    res.json({ success: true, data: Object.values(dateMap) });
  } catch (error) {
    next(error);
  }
};

exports.getTopProducts = async (req, res, next) => {
  try {
    const { limit = 10, type = 'stock_out' } = req.query;
    const thirtyDaysAgo = new Date(); thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const topProducts = await Transaction.aggregate([
      { $match: { type, createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: '$product', totalQty: { $sum: '$quantity' }, totalValue: { $sum: '$totalValue' }, count: { $sum: 1 } } },
      { $sort: { totalQty: -1 } },
      { $limit: Number(limit) },
      { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
      { $unwind: '$product' },
      { $project: { 'product.name': 1, 'product.sku': 1, 'product.category': 1, totalQty: 1, totalValue: 1, count: 1 } }
    ]);

    res.json({ success: true, data: topProducts });
  } catch (error) {
    next(error);
  }
};

exports.getCategoryBreakdown = async (req, res, next) => {
  try {
    const breakdown = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalStock: { $sum: '$currentStock' },
          totalValue: { $sum: { $multiply: ['$currentStock', '$costPrice'] } },
          avgPrice: { $avg: '$costPrice' }
        }
      },
      { $sort: { totalValue: -1 } }
    ]);

    res.json({ success: true, data: breakdown });
  } catch (error) {
    next(error);
  }
};

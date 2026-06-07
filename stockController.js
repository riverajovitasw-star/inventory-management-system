const Product = require('../models/Product');
const Transaction = require('../models/Transaction');
const logActivity = require('../utils/logger');

exports.stockIn = async (req, res, next) => {
  try {
    const { productId, quantity, unitPrice, reference, notes } = req.body;
    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({ success: false, message: 'Valid productId and quantity are required' });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const previousStock = product.currentStock;
    product.currentStock += Number(quantity);
    await product.save();

    const transaction = await Transaction.create({
      product: productId,
      type: 'stock_in',
      quantity: Number(quantity),
      previousStock,
      newStock: product.currentStock,
      unitPrice: unitPrice || product.costPrice,
      totalValue: (unitPrice || product.costPrice) * quantity,
      reference,
      notes,
      performedBy: req.user._id
    });

    await transaction.populate('product', 'name sku');
    await transaction.populate('performedBy', 'name email');
    await logActivity(req, 'STOCK_IN', 'Product', productId, { quantity, newStock: product.currentStock });

    res.status(201).json({ success: true, data: transaction, product });
  } catch (error) {
    next(error);
  }
};

exports.stockOut = async (req, res, next) => {
  try {
    const { productId, quantity, unitPrice, reference, reason, notes } = req.body;
    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({ success: false, message: 'Valid productId and quantity are required' });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    if (product.currentStock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Available: ${product.currentStock}, Requested: ${quantity}`
      });
    }

    const previousStock = product.currentStock;
    product.currentStock -= Number(quantity);
    await product.save();

    const transaction = await Transaction.create({
      product: productId,
      type: 'stock_out',
      quantity: Number(quantity),
      previousStock,
      newStock: product.currentStock,
      unitPrice: unitPrice || product.sellingPrice,
      totalValue: (unitPrice || product.sellingPrice) * quantity,
      reference,
      reason,
      notes,
      performedBy: req.user._id
    });

    await transaction.populate('product', 'name sku');
    await transaction.populate('performedBy', 'name email');
    await logActivity(req, 'STOCK_OUT', 'Product', productId, { quantity, newStock: product.currentStock });

    res.status(201).json({ success: true, data: transaction, product });
  } catch (error) {
    next(error);
  }
};

exports.adjustStock = async (req, res, next) => {
  try {
    const { productId, newQuantity, notes } = req.body;
    if (!productId || newQuantity === undefined || newQuantity < 0) {
      return res.status(400).json({ success: false, message: 'Valid productId and newQuantity are required' });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const previousStock = product.currentStock;
    const adjustmentQty = newQuantity - previousStock;
    product.currentStock = Number(newQuantity);
    await product.save();

    const transaction = await Transaction.create({
      product: productId,
      type: 'adjustment',
      quantity: Math.abs(adjustmentQty),
      previousStock,
      newStock: product.currentStock,
      notes: notes || `Stock adjusted from ${previousStock} to ${newQuantity}`,
      performedBy: req.user._id
    });

    await logActivity(req, 'STOCK_ADJUST', 'Product', productId, { previousStock, newStock: newQuantity });
    res.json({ success: true, data: transaction, product });
  } catch (error) {
    next(error);
  }
};

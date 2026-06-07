const Product = require('../models/Product');
const logActivity = require('../utils/logger');

exports.getProducts = async (req, res, next) => {
  try {
    const { search, category, status, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const query = {};

    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { sku: { $regex: search, $options: 'i' } },
      { supplier: { $regex: search, $options: 'i' } }
    ];
    if (category) query.category = { $regex: category, $options: 'i' };
    if (status === 'active') query.isActive = true;
    if (status === 'inactive') query.isActive = false;
    if (status === 'low_stock') query.$expr = { $lte: ['$currentStock', '$minStockLevel'] };
    if (status === 'out_of_stock') query.currentStock = 0;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('createdBy', 'name email')
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      data: products,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit), limit: Number(limit) }
    });
  } catch (error) {
    next(error);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('createdBy', 'name email');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    req.body.createdBy = req.user._id;
    const product = await Product.create(req.body);
    await logActivity(req, 'CREATE_PRODUCT', 'Product', product._id, { name: product.name, sku: product.sku });
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    await logActivity(req, 'UPDATE_PRODUCT', 'Product', product._id, { name: product.name });
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    product.isActive = false;
    await product.save();
    await logActivity(req, 'DELETE_PRODUCT', 'Product', product._id, { name: product.name });
    res.json({ success: true, message: 'Product deactivated successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct('category');
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

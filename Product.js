const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  sku: { type: String, required: true, unique: true, uppercase: true },
  description: { type: String, trim: true },
  category: { type: String, required: true, trim: true },
  unit: { type: String, default: 'pcs', trim: true },
  costPrice: { type: Number, required: true, min: 0 },
  sellingPrice: { type: Number, required: true, min: 0 },
  currentStock: { type: Number, default: 0, min: 0 },
  minStockLevel: { type: Number, default: 10, min: 0 },
  maxStockLevel: { type: Number, default: 1000, min: 0 },
  supplier: { type: String, trim: true },
  location: { type: String, trim: true },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

productSchema.virtual('stockStatus').get(function () {
  if (this.currentStock === 0) return 'out_of_stock';
  if (this.currentStock <= this.minStockLevel) return 'low_stock';
  return 'in_stock';
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);

const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  type: { type: String, enum: ['stock_in', 'stock_out', 'adjustment'], required: true },
  quantity: { type: Number, required: true },
  previousStock: { type: Number, required: true },
  newStock: { type: Number, required: true },
  unitPrice: { type: Number },
  totalValue: { type: Number },
  reference: { type: String, trim: true },
  reason: { type: String, trim: true },
  notes: { type: String, trim: true },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);

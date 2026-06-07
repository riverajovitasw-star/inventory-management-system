const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const Product = require('../models/Product');
const Transaction = require('../models/Transaction');

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/inventory_db');
  console.log('Connected to MongoDB...');

  await User.deleteMany();
  await Product.deleteMany();
  await Transaction.deleteMany();

  const admin = await User.create({
    name: 'Admin User', email: 'admin@inventory.com', password: 'admin123', role: 'admin'
  });
  const staff = await User.create({
    name: 'Staff User', email: 'staff@inventory.com', password: 'staff123', role: 'staff'
  });

  console.log('Users seeded');

  const categories = ['Electronics', 'Office Supplies', 'Furniture', 'Clothing', 'Food & Beverages'];
  const products = [];

  const productData = [
    { name: 'Laptop Pro 15"', sku: 'LAP-001', category: 'Electronics', costPrice: 800, sellingPrice: 1200, currentStock: 45, minStockLevel: 10 },
    { name: 'Wireless Mouse', sku: 'MOU-001', category: 'Electronics', costPrice: 15, sellingPrice: 35, currentStock: 120, minStockLevel: 20 },
    { name: 'USB-C Hub', sku: 'HUB-001', category: 'Electronics', costPrice: 25, sellingPrice: 55, currentStock: 8, minStockLevel: 15 },
    { name: 'Mechanical Keyboard', sku: 'KEY-001', category: 'Electronics', costPrice: 60, sellingPrice: 110, currentStock: 32, minStockLevel: 10 },
    { name: 'Monitor 27"', sku: 'MON-001', category: 'Electronics', costPrice: 250, sellingPrice: 400, currentStock: 18, minStockLevel: 5 },
    { name: 'A4 Paper Ream', sku: 'PAP-001', category: 'Office Supplies', costPrice: 4, sellingPrice: 8, currentStock: 0, minStockLevel: 50 },
    { name: 'Ballpoint Pens Box', sku: 'PEN-001', category: 'Office Supplies', costPrice: 3, sellingPrice: 7, currentStock: 200, minStockLevel: 30 },
    { name: 'Stapler', sku: 'STA-001', category: 'Office Supplies', costPrice: 8, sellingPrice: 15, currentStock: 40, minStockLevel: 10 },
    { name: 'Notebook A5', sku: 'NB-001', category: 'Office Supplies', costPrice: 2, sellingPrice: 5, currentStock: 5, minStockLevel: 20 },
    { name: 'Ergonomic Chair', sku: 'CHR-001', category: 'Furniture', costPrice: 200, sellingPrice: 350, currentStock: 12, minStockLevel: 3 },
    { name: 'Standing Desk', sku: 'DSK-001', category: 'Furniture', costPrice: 400, sellingPrice: 700, currentStock: 7, minStockLevel: 2 },
    { name: 'Bookshelf', sku: 'BSH-001', category: 'Furniture', costPrice: 80, sellingPrice: 150, currentStock: 15, minStockLevel: 5 },
    { name: 'T-Shirt (M)', sku: 'TSH-001', category: 'Clothing', costPrice: 8, sellingPrice: 20, currentStock: 80, minStockLevel: 20 },
    { name: 'Hoodie (L)', sku: 'HOD-001', category: 'Clothing', costPrice: 20, sellingPrice: 50, currentStock: 45, minStockLevel: 15 },
    { name: 'Coffee Beans 1kg', sku: 'COF-001', category: 'Food & Beverages', costPrice: 12, sellingPrice: 25, currentStock: 60, minStockLevel: 20 },
  ];

  for (const p of productData) {
    const product = await Product.create({ ...p, supplier: 'Default Supplier', createdBy: admin._id });
    products.push(product);
  }

  console.log('Products seeded');

  // Create some transactions
  const users = [admin, staff];
  for (let i = 0; i < 50; i++) {
    const product = products[Math.floor(Math.random() * products.length)];
    const type = Math.random() > 0.4 ? 'stock_in' : 'stock_out';
    const quantity = Math.floor(Math.random() * 20) + 1;
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));

    await Transaction.create({
      product: product._id,
      type,
      quantity,
      previousStock: product.currentStock,
      newStock: type === 'stock_in' ? product.currentStock + quantity : Math.max(0, product.currentStock - quantity),
      unitPrice: type === 'stock_in' ? product.costPrice : product.sellingPrice,
      totalValue: (type === 'stock_in' ? product.costPrice : product.sellingPrice) * quantity,
      performedBy: users[Math.floor(Math.random() * users.length)]._id,
      createdAt: date
    });
  }

  console.log('Transactions seeded');
  console.log('\n✅ Seed complete!');
  console.log('Admin: admin@inventory.com / admin123');
  console.log('Staff: staff@inventory.com / staff123');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });

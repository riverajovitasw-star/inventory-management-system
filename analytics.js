const express = require('express');
const router = express.Router();
const { getDashboardStats, getStockMovement, getTopProducts, getCategoryBreakdown } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/dashboard', getDashboardStats);
router.get('/stock-movement', getStockMovement);
router.get('/top-products', getTopProducts);
router.get('/category-breakdown', getCategoryBreakdown);

module.exports = router;

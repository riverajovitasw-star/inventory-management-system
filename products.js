const express = require('express');
const router = express.Router();
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getCategories } = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/categories', getCategories);
router.route('/').get(getProducts).post(authorize('admin'), createProduct);
router.route('/:id').get(getProduct).put(authorize('admin'), updateProduct).delete(authorize('admin'), deleteProduct);

module.exports = router;

const express = require('express');
const router = express.Router();
const { stockIn, stockOut, adjustStock } = require('../controllers/stockController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.post('/in', stockIn);
router.post('/out', stockOut);
router.post('/adjust', authorize('admin'), adjustStock);

module.exports = router;

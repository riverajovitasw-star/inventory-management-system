const express = require('express');
const router = express.Router();
const { getTransactions, getTransaction } = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', getTransactions);
router.get('/:id', getTransaction);

module.exports = router;

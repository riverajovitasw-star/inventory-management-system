const express = require('express');
const router = express.Router();
const { getLogs } = require('../controllers/logController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));
router.get('/', getLogs);

module.exports = router;

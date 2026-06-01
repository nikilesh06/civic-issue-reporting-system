const express = require('express');
const router = express.Router();
const { getSummary, getMonthlyTrend } = require('../controllers/analyticsController');
const { protect, requireRole } = require('../middleware/auth');

router.get('/summary', protect, requireRole('admin', 'councillor'), getSummary);
router.get('/monthly', protect, requireRole('admin', 'councillor'), getMonthlyTrend);

module.exports = router;

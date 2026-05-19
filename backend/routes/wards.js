const express = require('express');
const router = express.Router();
const { getWards, getWardById, createWard, updateWard, deleteWard } = require('../controllers/wardController');
const { protect, requireRole } = require('../middleware/auth');

router.get('/', getWards);
router.get('/:id', getWardById);
router.post('/', protect, requireRole('admin'), createWard);
router.put('/:id', protect, requireRole('admin'), updateWard);
router.delete('/:id', protect, requireRole('admin'), deleteWard);

module.exports = router;

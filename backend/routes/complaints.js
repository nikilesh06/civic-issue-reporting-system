const express = require('express');
const router = express.Router();
const {
  createComplaint, getComplaints, getComplaintById,
  updateComplaintStatus, deleteComplaint
} = require('../controllers/complaintController');
const { protect, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', protect, upload.single('image'), createComplaint);
router.get('/', protect, getComplaints);
router.get('/:id', protect, getComplaintById);
router.patch('/:id/status', protect, requireRole('admin', 'councillor'), updateComplaintStatus);
router.delete('/:id', protect, requireRole('admin'), deleteComplaint);

module.exports = router;

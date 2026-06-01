const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTP, loginOfficial, getMe, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/official-login', loginOfficial);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;

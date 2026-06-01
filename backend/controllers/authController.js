const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// Utility to generate a random 6-digit OTP for 2FA
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

/**
 * Configures the Nodemailer transporter.
 * Note: Uses console fallback if credentials are missing in development.
 */
const getTransporter = () => {
  if (process.env.GMAIL_USER && process.env.GMAIL_PASS &&
      process.env.GMAIL_USER !== 'your_gmail@gmail.com') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
    });
  }
  return null;
};

const sendOTP = async (req, res) => {
  try {
    const { email, name, ward, isOfficialMode } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    let user = await User.findOne({ email });

    if (isOfficialMode) {
      // Official Login Flow (Admin & Councillor)
      if (!user || (user.role !== 'admin' && user.role !== 'councillor')) {
        return res.status(403).json({ message: 'Unauthorized: Official account not found' });
      }
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();
    } else {
      // Citizen Login/Registration Flow
      if (!user) {
        if (!ward) return res.status(400).json({ message: 'Ward selection is required for new users' });
        user = await User.create({ email, name: name || 'Citizen', ward, otp, otpExpiry });
      } else {
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        if (name) user.name = name;
        if (ward) user.ward = ward;
        await user.save();
      }
    }

    const transporter = getTransporter();
    if (transporter) {
      await transporter.sendMail({
        from: `"Civic Issue Reporter" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Your OTP for Civic Issue Reporting System',
        html: `
          <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;">
            <h2 style="color:#4f46e5;">🏛️ Civic Issue Reporting</h2>
            <p>Your One-Time Password (OTP) is:</p>
            <div style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#4f46e5;padding:16px;background:#eef2ff;border-radius:8px;text-align:center;">${otp}</div>
            <p style="color:#6b7280;margin-top:16px;">This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
          </div>
        `,
      });
      console.log(`📧 OTP sent to ${email}`);
    } else {
      // Console fallback
      console.log(`\n🔐 ============================`);
      console.log(`   OTP for ${email}: ${otp}`);
      console.log(`🔐 ============================\n`);
    }

    res.json({ message: 'OTP sent successfully', userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send OTP', error: err.message });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

    const user = await User.findOne({ email }).populate('ward');
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.otp || user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
    if (user.otpExpiry < new Date()) return res.status(400).json({ message: 'OTP expired' });

    user.otp = undefined;
    user.otpExpiry = undefined;
    user.isVerified = true;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        ward: user.ward,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'OTP verification failed', error: err.message });
  }
};

const loginOfficial = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email }).populate('ward');
    if (!user || (user.role !== 'admin' && user.role !== 'councillor')) {
      return res.status(401).json({ message: 'Invalid official credentials' });
    }

    if (!user.password) {
      return res.status(401).json({ message: 'Account not set up for password login' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid official credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        ward: user.ward,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

const getMe = async (req, res) => {
  res.json(req.user);
};

const updateProfile = async (req, res) => {
  try {
    const { name, ward } = req.body;
    const user = await User.findById(req.user._id);
    if (name) user.name = name;
    if (ward) user.ward = ward;
    await user.save();
    await user.populate('ward');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { sendOTP, verifyOTP, loginOfficial, getMe, updateProfile };

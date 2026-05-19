const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  ward: { type: mongoose.Schema.Types.ObjectId, ref: 'Ward' },
  role: { type: String, enum: ['citizen', 'admin', 'councillor'], default: 'citizen' },
  otp: { type: String },
  otpExpiry: { type: Date },
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

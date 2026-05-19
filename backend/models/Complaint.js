const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  issueCategory: {
    type: String,
    enum: ['Garbage', 'Road Damage', 'Water Leakage', 'Drainage', 'Streetlight', 'Others'],
    required: true,
  },
  image: { type: String },
  location: {
    lat: { type: Number },
    lng: { type: Number },
    address: { type: String },
  },
  ward: { type: mongoose.Schema.Types.ObjectId, ref: 'Ward', required: true },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending',
  },
  resolvedAt: { type: Date },
  adminNote: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);

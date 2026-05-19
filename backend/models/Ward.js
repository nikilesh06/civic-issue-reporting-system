const mongoose = require('mongoose');

const wardSchema = new mongoose.Schema({
  wardNumber: { type: Number, required: true, unique: true },
  wardName: { type: String, required: true },
  councillorName: { type: String, required: true },
  councillorEmail: { type: String },
  councillorPhone: { type: String },
  councillorPhoto: { type: String },
  area: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Ward', wardSchema);

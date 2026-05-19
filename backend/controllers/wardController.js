const Ward = require('../models/Ward');

const getWards = async (req, res) => {
  try {
    const wards = await Ward.find().sort({ wardNumber: 1 });
    res.json(wards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getWardById = async (req, res) => {
  try {
    const ward = await Ward.findById(req.params.id);
    if (!ward) return res.status(404).json({ message: 'Ward not found' });
    res.json(ward);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createWard = async (req, res) => {
  try {
    const ward = await Ward.create(req.body);
    res.status(201).json(ward);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateWard = async (req, res) => {
  try {
    const ward = await Ward.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!ward) return res.status(404).json({ message: 'Ward not found' });
    res.json(ward);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteWard = async (req, res) => {
  try {
    const ward = await Ward.findByIdAndDelete(req.params.id);
    if (!ward) return res.status(404).json({ message: 'Ward not found' });
    res.json({ message: 'Ward deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getWards, getWardById, createWard, updateWard, deleteWard };

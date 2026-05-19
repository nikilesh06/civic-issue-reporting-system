const Complaint = require('../models/Complaint');
const path = require('path');

const createComplaint = async (req, res) => {
  try {
    const { title, description, issueCategory, ward, lat, lng, address } = req.body;
    if (!title || !description || !issueCategory || !ward) {
      return res.status(400).json({ message: 'Title, description, category and ward are required' });
    }
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const complaint = await Complaint.create({
      userId: req.user._id,
      title,
      description,
      issueCategory,
      ward,
      image,
      location: { lat: lat || null, lng: lng || null, address: address || '' },
    });
    await complaint.populate(['userId', 'ward']);
    res.status(201).json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getComplaints = async (req, res) => {
  try {
    const { status, ward, category, limit } = req.query;
    let query = {};
    
    if (req.user.role === 'citizen') {
      query.userId = req.user._id;
    } else if (req.user.role === 'councillor') {
      query.ward = req.user.ward._id;
    }

    if (status) query.status = status;
    if (ward) query.ward = ward;
    if (category) query.issueCategory = category;

    const complaintsQuery = Complaint.find(query)
      .populate('userId', 'name email')
      .populate('ward', 'wardNumber wardName councillorName')
      .sort({ createdAt: -1 });

    if (limit) complaintsQuery.limit(parseInt(limit));

    const complaints = await complaintsQuery;
    res.json({ count: complaints.length, complaints });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching complaints', error: error.message });
  }
};

const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('ward');
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    if (req.user.role === 'citizen' && complaint.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateComplaintStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    // Prevent councillor from modifying other wards
    if (req.user.role === 'councillor' && complaint.ward.toString() !== req.user.ward.toString()) {
      return res.status(403).json({ message: 'Unauthorized: Can only update complaints in your ward' });
    }

    complaint.status = status;
    if (adminNote) complaint.adminNote = adminNote;
    if (status === 'Resolved' && !complaint.resolvedAt) {
      complaint.resolvedAt = Date.now();
    }

    await complaint.save();
    const updated = await Complaint.findById(req.params.id)
      .populate('userId', 'name')
      .populate('ward', 'wardNumber wardName');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating complaint', error: error.message });
  }
};

const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    await complaint.deleteOne();
    res.json({ message: 'Complaint deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createComplaint, getComplaints, getComplaintById, updateComplaintStatus, deleteComplaint };

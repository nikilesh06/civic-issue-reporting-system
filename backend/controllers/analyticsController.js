const Complaint = require('../models/Complaint');

// @desc    Get dashboard summary stats
// @route   GET /api/analytics/summary
const getSummary = async (req, res) => {
  try {
    const matchStage = {};
    if (req.user.role === 'councillor' && req.user.ward) {
      matchStage.ward = req.user.ward;
    }

    const total = await Complaint.countDocuments(matchStage);
    const pending = await Complaint.countDocuments({ ...matchStage, status: 'Pending' });
    const inProgress = await Complaint.countDocuments({ ...matchStage, status: 'In Progress' });
    const resolved = await Complaint.countDocuments({ ...matchStage, status: 'Resolved' });

    res.json({ total, pending, inProgress, resolved });
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving summary' });
  }
};

// @desc    Get monthly complaint trend
// @route   GET /api/analytics/monthly
const getMonthlyTrend = async (req, res) => {
  try {
    const matchStage = {};
    if (req.user.role === 'councillor' && req.user.ward) {
      matchStage.ward = req.user.ward;
    }

    const monthlyData = await Complaint.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: 1 },
          resolved: { $sum: { $cond: [{ $eq: ["$status", "Resolved"] }, 1, 0] } }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const result = monthlyData.map(item => ({
      month: months[item._id - 1],
      total: item.total,
      resolved: item.resolved
    }));

    if (result.length === 0) {
       const currentMonth = new Date().getMonth();
       result.push({ month: months[currentMonth], total: 0, resolved: 0 });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving monthly trend' });
  }
};

module.exports = { getSummary, getMonthlyTrend };

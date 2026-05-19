require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
const mongoose = require('mongoose');
const Ward = require('./models/Ward');
const User = require('./models/User');
const Complaint = require('./models/Complaint');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI, { family: 4 });
  console.log('Connected to DB for seeding...');

  // Clear existing data
  await Ward.deleteMany();
  await User.deleteMany();
  await Complaint.deleteMany();

  // Create wards
  const wards = await Ward.insertMany([
    { wardNumber: 1, wardName: 'Anna Nagar', councillorName: 'Ravi Kumar', councillorEmail: 'ravi@ward1.gov', councillorPhone: '9876500001', area: 'East Madurai' },
    { wardNumber: 2, wardName: 'KK Nagar', councillorName: 'Priya Nair', councillorEmail: 'priya@ward2.gov', councillorPhone: '9876500002', area: 'East Madurai' },
    { wardNumber: 3, wardName: 'SS Colony', councillorName: 'Suresh Babu', councillorEmail: 'suresh@ward3.gov', councillorPhone: '9876500003', area: 'West Madurai' },
    { wardNumber: 4, wardName: 'Tallakulam', councillorName: 'Meena Devi', councillorEmail: 'meena@ward4.gov', councillorPhone: '9876500004', area: 'North Madurai' },
    { wardNumber: 5, wardName: 'Thiruparankundram', councillorName: 'Karthik Raja', councillorEmail: 'karthik@ward5.gov', councillorPhone: '9876500005', area: 'South Madurai' },
  ]);

  // Create admin user
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@civic.gov',
    role: 'admin',
    isVerified: true,
  });

  // Create councillor users
  const councillors = await User.insertMany(
    wards.map((w, i) => ({
      name: w.councillorName,
      email: w.councillorEmail,
      role: 'councillor',
      isVerified: true,
      ward: w._id,
    }))
  );

  // Create citizen users
  const citizens = await User.insertMany([
    { name: 'Arjun Sharma', email: 'arjun@example.com', role: 'citizen', isVerified: true, ward: wards[0]._id },
    { name: 'Divya Menon', email: 'divya@example.com', role: 'citizen', isVerified: true, ward: wards[1]._id },
    { name: 'Ramesh Iyer', email: 'ramesh@example.com', role: 'citizen', isVerified: true, ward: wards[2]._id },
  ]);

  // Create sample complaints across 6 months
  const categories = ['Garbage', 'Road Damage', 'Water Leakage', 'Drainage', 'Streetlight', 'Others'];
  const statuses = ['Pending', 'In Progress', 'Resolved'];
  const complaints = [];

  for (let i = 0; i < 30; i++) {
    const monthsBack = Math.floor(i / 5);
    const date = new Date();
    date.setMonth(date.getMonth() - monthsBack);
    const ward = wards[i % wards.length];
    const citizen = citizens[i % citizens.length];
    const status = statuses[i % 3];
    complaints.push({
      userId: citizen._id,
      title: `${categories[i % categories.length]} issue in ${ward.wardName}`,
      description: `There is a serious ${categories[i % categories.length].toLowerCase()} problem that needs immediate attention in the ${ward.wardName} area.`,
      issueCategory: categories[i % categories.length],
      ward: ward._id,
      status,
      location: { lat: 9.9252 + (Math.random() * 0.05 - 0.025), lng: 78.1198 + (Math.random() * 0.05 - 0.025), address: `${ward.wardName}, Madurai` },
      createdAt: date,
      resolvedAt: status === 'Resolved' ? date : null,
    });
  }
  await Complaint.insertMany(complaints);

  console.log('Database seeded successfully.');
  console.log('Admin login: admin@civic.gov');
  console.log('Councillor login: ravi@ward1.gov');
  console.log('Citizen login: arjun@example.com');
  mongoose.disconnect();
};

seed().catch(console.error);

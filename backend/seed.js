require('dotenv').config();
const dns = require('dns');
dns.setServers(['192.168.0.3', '8.8.8.8', '1.1.1.1']);
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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
  // Create wards for Dindigul City
  const dindigulWards = [
    { num: 1, name: 'M. Kirubakaran', party: 'DMK', phone: '9843191101' },
    { num: 2, name: 'S. Ganesan', party: 'CPI(M)', phone: '9790526023' },
    { num: 3, name: 'V. Indrani', party: 'DMK', phone: '7373156700' },
    { num: 4, name: 'C.S. Rajmohan', party: 'ADMK', phone: '9003633333' },
    { num: 5, name: 'J. Swathi', party: 'DMK', phone: '8344524300' },
    { num: 6, name: 'O. Saranya', party: 'DMK', phone: '8807803900' },
    { num: 7, name: 'R. Subas', party: 'DMK', phone: '9150598598' },
    { num: 8, name: 'R. Anand', party: 'DMK', phone: '9500909019' },
    { num: 9, name: 'P. Shanthi', party: 'DMK', phone: '7904836633' },
    { num: 10, name: 'J. Banupriya', party: 'DMK', phone: '8608261883' },
    { num: 11, name: 'K. Mariammal', party: 'CPI(M)', phone: '6369018874' },
    { num: 12, name: 'C. Janakiraman', party: 'DMK', phone: '8825174488' },
    { num: 13, name: 'A. Arulvani', party: 'DMK', phone: '9865247308' },
    { num: 14, name: 'G. Dhanabalan', party: 'BJP', phone: '9894270676' },
    { num: 15, name: 'M. Sathiyavani', party: 'ADMK', phone: '9842277728' },
    { num: 16, name: 'Vacant', party: '—', phone: '—' },
    { num: 17, name: 'K.K.R. Venkatesh', party: 'Independent', phone: '9655577237' },
    { num: 18, name: 'A. Mohamed Siddiq', party: 'DMK', phone: '8220940404' },
    { num: 19, name: 'A. Arockia Selvi', party: 'DMK', phone: '8643091601' },
    { num: 20, name: 'J. Jayanthi', party: 'DMK', phone: '9788680343' },
    { num: 21, name: 'J. Karthick', party: 'INC', phone: '9944881618' },
    { num: 22, name: 'K. Senthil Kumar', party: 'DMK', phone: '9943330701' },
    { num: 23, name: 'J. Ilamathi (Mayor)', party: 'DMK', phone: '9786445969' },
    { num: 24, name: 'M. Stella Mary', party: 'DMK', phone: '9677741008' },
    { num: 25, name: 'N. Sivakumar', party: 'DMK', phone: '9944460362' },
    { num: 26, name: 'R. Mohamed Iliyas', party: 'IUML', phone: '9940920004' },
    { num: 27, name: 'J. Barathi', party: 'INC', phone: '8489330480' },
    { num: 28, name: 'A. Natarajan', party: 'VCK', phone: '9994104525' },
    { num: 29, name: 'S. Manoranjitham', party: 'DMK', phone: '8344950385' },
    { num: 30, name: 'S. Lakshmi', party: 'DMK', phone: '9894166330' },
    { num: 31, name: 'P. Umadevi', party: 'ADMK', phone: '9842136444' },
    { num: 32, name: 'S. Rajappa (Deputy Mayor)', party: 'DMK', phone: '9842142478' },
    { num: 33, name: 'A. John Peter', party: 'DMK', phone: '9994894354' },
    { num: 34, name: 'S. Baskaran', party: 'ADMK', phone: '9962635333' },
    { num: 35, name: 'S. Jothibasu', party: 'CPI(M)', phone: '9597991112' },
    { num: 36, name: 'M. Powmidha Parveen', party: 'DMK', phone: '9994944831' },
    { num: 37, name: 'U. Nithya', party: 'DMK', phone: '9790293951' },
    { num: 38, name: 'A. Vasanthi', party: 'Independent', phone: '9786558999' },
    { num: 39, name: 'M. Bilal Usen', party: 'DMK', phone: '9150588319' },
    { num: 40, name: 'K. Haseena Parveen', party: 'DMK', phone: '9361136013' },
    { num: 41, name: 'A. Vimala Arockiamary', party: 'Independent', phone: '9789526611' },
    { num: 42, name: 'C. Therasa Mary', party: 'DMK', phone: '9600466324' },
    { num: 43, name: 'C. Vijaya', party: 'DMK', phone: '9965111603' },
    { num: 44, name: 'A. Marthandan', party: 'Independent', phone: '8248846525' },
    { num: 45, name: 'S. Amalorpava Mary', party: 'ADMK', phone: '9698143760' },
    { num: 46, name: 'R. Kulothungan', party: 'Independent', phone: '8675052435' },
    { num: 47, name: 'K. Subashini', party: 'DMK', phone: '9245136123' },
    { num: 48, name: 'J. Gayathri', party: 'DMK', phone: '9791484403' }
  ];

  const wards = await Ward.insertMany(dindigulWards.map(w => ({
    wardNumber: w.num,
    wardName: `Ward ${w.num}`,
    councillorName: w.name,
    councillorEmail: `ward${w.num}@dindigul.gov`,
    councillorPhone: w.phone,
    area: 'Dindigul City'
  })));

  // Generate default password hash for officials
  const salt = await bcrypt.genSalt(10);
  const defaultPassword = await bcrypt.hash('admin123', salt);

  // Create admin user
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@civic.gov',
    role: 'admin',
    password: defaultPassword,
    isVerified: true,
  });

  // Create councillor users (skip vacant)
  const councillors = await User.insertMany(
    wards.filter(w => w.councillorName !== 'Vacant').map(w => ({
      name: w.councillorName,
      email: w.councillorEmail,
      role: 'councillor',
      password: defaultPassword,
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
      location: { lat: 10.3673 + (Math.random() * 0.05 - 0.025), lng: 77.9803 + (Math.random() * 0.05 - 0.025), address: `${ward.wardName}, Dindigul` },
      createdAt: date,
      resolvedAt: status === 'Resolved' ? date : null,
    });
  }
  await Complaint.insertMany(complaints);

  console.log('Database seeded successfully.');
  console.log('Admin login: admin@civic.gov');
  console.log('Councillor login: ward1@dindigul.gov (Password: admin123)');
  console.log('Citizen login: arjun@example.com');
  mongoose.disconnect();
};

seed().catch(console.error);

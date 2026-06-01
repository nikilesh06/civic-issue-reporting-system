import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { FileText, Clock, CheckCircle, TrendingUp, Users, MapPin, Activity, ChevronRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#f59e0b', '#0284c7', '#10b981'];
const CATEGORY_ICONS = { Garbage:'🗑️', 'Road Damage':'🛣️', 'Water Leakage':'💧', Drainage:'🚰', Streetlight:'💡', Others:'📋' };

const AdminDashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [monthly, setMonthly] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/analytics/summary'),
      api.get('/analytics/monthly'),
      api.get('/complaints?limit=6'),
    ]).then(([s, m, c]) => {
      setSummary(s.data);
      setMonthly(m.data);
      setRecent(c.data.complaints || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const pieData = summary ? [
    { name: 'Pending', value: summary.pending },
    { name: 'In Progress', value: summary.inProgress },
    { name: 'Resolved', value: summary.resolved },
  ] : [];

  const stats = [
    { label:'Total Complaints', value: summary?.total || 0, icon: FileText, color:'#1e3a8a', bg:'rgba(79,70,229,0.15)', delta:'+12%' },
    { label:'Pending', value: summary?.pending || 0, icon: Clock, color:'#f59e0b', bg:'rgba(245,158,11,0.15)', delta:'Needs attention' },
    { label:'In Progress', value: summary?.inProgress || 0, icon: Activity, color:'#0284c7', bg:'rgba(6,182,212,0.15)', delta:'Active' },
    { label:'Resolved', value: summary?.resolved || 0, icon: CheckCircle, color:'#10b981', bg:'rgba(16,185,129,0.15)', delta:'Completed' },
  ];

  return (
    <div style={{ background:'#f0f4f8', minHeight:'100vh' }}>
      <Navbar />
      <div style={{ display:'flex' }}>
        <Sidebar />
        <main className="admin-page-body" style={{ flex:1, padding:'2rem 1.5rem', minWidth:0 }}>
          <div className="fade-in" style={{ marginBottom:'1.75rem' }}>
            <h1 style={{ fontSize:'1.6rem', fontWeight:800, color:'#0f172a' }}>
              {user?.role === 'councillor' ? 'Councillor Dashboard' : 'Admin Dashboard'}
            </h1>
            <p style={{ color:'#64748b', fontSize:'0.875rem', marginTop:4 }}>
              Welcome back, {user?.name} — here's the overview for {user?.role === 'councillor' ? 'your ward' : 'the system'}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'1rem', marginBottom:'1.75rem' }}>
            {stats.map(({ label, value, icon: Icon, color, bg, delta }) => (
              <div key={label} className="stat-card fade-in">
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                  <p style={{ fontSize:'0.78rem', color:'#94a3b8', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.05em' }}>{label}</p>
                  <div style={{ width:38, height:38, borderRadius:10, background:bg, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Icon size={18} color={color} />
                  </div>
                </div>
                <p style={{ fontSize:'2.2rem', fontWeight:800, color, lineHeight:1 }}>{loading ? '—' : value}</p>
                <p style={{ fontSize:'0.75rem', color:'#94a3b8', marginTop:6 }}>{delta}</p>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="charts-grid" style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'1.25rem', marginBottom:'1.75rem' }}>
            {/* Area Chart */}
            <div className="card" style={{ padding:'1.5rem' }}>
              <h2 style={{ fontSize:'0.95rem', fontWeight:700, color:'#0f172a', marginBottom:'1.25rem' }}>Monthly Complaint Trend</h2>
              {loading ? <div style={{ height:220, display:'flex', alignItems:'center', justifyContent:'center', color:'#64748b' }}>Loading...</div> : (
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={monthly} margin={{ top:5, right:10, left:-20, bottom:0 }}>
                    <defs>
                      <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="resolved" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" />
                    <XAxis dataKey="month" tick={{ fill:'#64748b', fontSize:11 }} />
                    <YAxis tick={{ fill:'#64748b', fontSize:11 }} />
                    <Tooltip contentStyle={{ background:'#ffffff', border:'1px solid #334155', borderRadius:8, color:'#0f172a', fontSize:12 }} />
                    <Area type="monotone" dataKey="total" stroke="#1e3a8a" fill="url(#total)" strokeWidth={2} name="Total" />
                    <Area type="monotone" dataKey="resolved" stroke="#10b981" fill="url(#resolved)" strokeWidth={2} name="Resolved" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Pie Chart */}
            <div className="card" style={{ padding:'1.5rem' }}>
              <h2 style={{ fontSize:'0.95rem', fontWeight:700, color:'#0f172a', marginBottom:'1.25rem' }}>Status Breakdown</h2>
              {loading ? <div style={{ height:220, display:'flex', alignItems:'center', justifyContent:'center', color:'#64748b' }}>Loading...</div> : (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                      {pieData.map((entry, i) => <Cell key={i} fill={COLORS[i]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background:'#ffffff', border:'1px solid #334155', borderRadius:8, color:'#0f172a', fontSize:12 }} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:12, color:'#94a3b8' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Recent Complaints */}
          <div className="card" style={{ padding:'1.5rem' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.25rem' }}>
              <h2 style={{ fontSize:'0.95rem', fontWeight:700, color:'#0f172a' }}>Recent Complaints</h2>
              <Link to="/admin/complaints" style={{ textDecoration:'none', color:'#2563eb', fontSize:'0.85rem', display:'flex', alignItems:'center', gap:4 }}>
                View All <ChevronRight size={14} />
              </Link>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr>
                  <th>Issue</th><th>Category</th><th>Ward</th><th>Status</th><th>Date</th>
                </tr></thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={5} style={{ textAlign:'center', color:'#64748b' }}>Loading...</td></tr>
                  ) : recent.map(c => (
                    <tr key={c._id}>
                      <td style={{ color:'#0f172a', fontWeight:500, maxWidth:200 }}><span style={{ display:'block', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{c.title}</span></td>
                      <td>{CATEGORY_ICONS[c.issueCategory]} {c.issueCategory}</td>
                      <td>Ward {c.ward?.wardNumber}</td>
                      <td><StatusBadge status={c.status} /></td>
                      <td>{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

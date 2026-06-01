import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import api from '../api/axios';
import { FileText, Clock, CheckCircle, Plus, MapPin, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CATEGORY_ICONS = { Garbage:'🗑️', 'Road Damage':'🛣️', 'Water Leakage':'💧', Drainage:'🚰', Streetlight:'💡', Others:'📋' };

const CitizenDashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [complaints, setComplaints] = useState([]);
  const [ward, setWard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: c }, { data: w }] = await Promise.all([
          api.get('/complaints?limit=5'),
          user?.ward?._id ? api.get(`/wards/${user.ward._id}`) : Promise.resolve({ data: user?.ward || null }),
        ]);
        setComplaints(c.complaints || []);
        setWard(w);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [user]);

  const total = complaints.length;
  const pending = complaints.filter(c => c.status === 'Pending').length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;

  const stats = [
    { label:'Total Complaints', value: total, icon: FileText, color:'#1e3a8a', bg:'rgba(79,70,229,0.15)' },
    { label:'Pending', value: pending, icon: Clock, color:'#f59e0b', bg:'rgba(245,158,11,0.15)' },
    { label:'Resolved', value: resolved, icon: CheckCircle, color:'#10b981', bg:'rgba(16,185,129,0.15)' },
  ];

  return (
    <div style={{ background:'#f0f4f8', minHeight:'100vh' }}>
      <Navbar />
      <div className="page-content" style={{ maxWidth:1100, margin:'0 auto', padding:'2rem 1.5rem' }}>
        {/* Header */}
        <div className="fade-in" style={{ marginBottom:'2rem' }}>
          <h1 style={{ fontSize:'1.6rem', fontWeight:800, color:'#0f172a' }}>
            {t('welcome')}, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p style={{ color:'#64748b', fontSize:'0.9rem', marginTop:4 }}>Track and manage your civic complaints</p>
        </div>

        {/* Ward Info */}
        {ward && (
          <div className="card fade-in" style={{ padding:'1.25rem 1.5rem', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
            <div style={{ width:44, height:44, borderRadius:12, background:'linear-gradient(135deg,#1e3a8a,#0284c7)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <MapPin size={20} color="white" />
            </div>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:'0.78rem', color:'#64748b', fontWeight:500 }}>YOUR WARD</p>
              <p style={{ color:'#0f172a', fontWeight:700 }}>Ward {ward.wardNumber} — {ward.wardName}</p>
              <p style={{ color:'#94a3b8', fontSize:'0.83rem' }}>Councillor: <span style={{color:'#2563eb'}}>{ward.councillorName}</span></p>
            </div>
            <Link to="/submit">
              <button className="btn-primary" style={{ fontSize:'0.85rem' }}>
                <Plus size={15} /> {t('submit_complaint')}
              </button>
            </Link>
          </div>
        )}

        {/* Stats */}
        <div className="stats-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'1rem', marginBottom:'2rem' }}>
          {stats.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="stat-card fade-in">
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                <p style={{ fontSize:'0.8rem', color:'#94a3b8', fontWeight:500 }}>{label}</p>
                <div style={{ width:36, height:36, borderRadius:10, background:bg, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Icon size={18} color={color} />
                </div>
              </div>
              <p style={{ fontSize:'2rem', fontWeight:800, color }}>{loading ? '—' : value}</p>
            </div>
          ))}
        </div>

        {/* Recent Complaints */}
        <div className="card" style={{ padding:'1.5rem' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.25rem' }}>
            <h2 style={{ fontSize:'1rem', fontWeight:700, color:'#0f172a' }}>{t('recent_complaints')}</h2>
            <Link to="/history" style={{ textDecoration:'none', color:'#2563eb', fontSize:'0.85rem', display:'flex', alignItems:'center', gap:4 }}>
              View All <ChevronRight size={14} />
            </Link>
          </div>
          {loading ? (
            <div style={{ textAlign:'center', padding:'2rem', color:'#64748b' }}>Loading...</div>
          ) : complaints.length === 0 ? (
            <div style={{ textAlign:'center', padding:'3rem' }}>
              <p style={{ fontSize:'2.5rem', marginBottom:8 }}>📋</p>
              <p style={{ color:'#64748b' }}>{t('no_complaints')}</p>
              <Link to="/submit"><button className="btn-primary" style={{ marginTop:'1rem' }}>{t('submit_complaint')}</button></Link>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {complaints.map(c => (
                <Link to="/history" key={c._id} style={{ textDecoration: 'none' }}>
                  <div className="fade-in" style={{ 
                    display:'flex', alignItems:'center', gap:16, padding:'1rem 1.25rem', 
                    background:'#ffffff', borderRadius:16, border:'1px solid #e2e8f0', 
                    boxShadow:'0 2px 10px rgba(0,0,0,0.02)', cursor:'pointer', transition:'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' 
                  }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(15, 23, 42, 0.08)';
                      e.currentTarget.style.borderColor = '#cbd5e1';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.02)';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                    }}>
                    <div style={{ 
                      width: 48, height: 48, borderRadius: 14, 
                      background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(14, 165, 233, 0.08))', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
                    }}>
                      <span style={{ fontSize:'1.4rem' }}>{CATEGORY_ICONS[c.issueCategory] || '📋'}</span>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ fontWeight:700, color:'#0f172a', fontSize:'0.95rem', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', marginBottom: 2 }}>{c.title}</p>
                      <p style={{ color:'#64748b', fontSize:'0.8rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Clock size={12} /> {new Date(c.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <StatusBadge status={c.status} />
                      <ChevronRight size={16} color="#94a3b8" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;

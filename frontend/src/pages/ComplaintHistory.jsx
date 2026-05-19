import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import api from '../api/axios';
import { Filter, Search, Calendar, MapPin, Image as ImageIcon } from 'lucide-react';

const CATEGORY_ICONS = { Garbage:'🗑️', 'Road Damage':'🛣️', 'Water Leakage':'💧', Drainage:'🚰', Streetlight:'💡', Others:'📋' };

const ComplaintHistory = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const params = new URLSearchParams({ limit: 50 });
        if (filter) params.append('status', filter);
        const { data } = await api.get(`/complaints?${params}`);
        setComplaints(data.complaints || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, [filter]);

  const filtered = complaints.filter(c =>
    c.title?.toLowerCase().includes(search.toLowerCase()) ||
    c.issueCategory?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ background:'#f0f4f8', minHeight:'100vh' }}>
      <Navbar />
      <div style={{ maxWidth:1000, margin:'0 auto', padding:'2rem 1.5rem' }}>
        <div className="fade-in" style={{ marginBottom:'1.5rem' }}>
          <h1 style={{ fontSize:'1.5rem', fontWeight:800, color:'#0f172a' }}>My Complaints</h1>
          <p style={{ color:'#64748b', fontSize:'0.875rem', marginTop:4 }}>Track all your submitted civic issues</p>
        </div>

        {/* Filters */}
        <div style={{ display:'flex', gap:12, marginBottom:'1.5rem', flexWrap:'wrap' }}>
          <div style={{ position:'relative', flex:1, minWidth:200 }}>
            <Search size={15} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#64748b' }} />
            <input className="input" placeholder="Search complaints..." value={search}
              onChange={e => setSearch(e.target.value)} style={{ paddingLeft:34 }} />
          </div>
          <select className="select" value={filter} onChange={e => setFilter(e.target.value)} style={{ width:'auto', minWidth:160 }}>
            <option value="">All Status</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
        </div>

        {loading ? (
          <div style={{ textAlign:'center', padding:'3rem', color:'#64748b' }}>Loading your complaints...</div>
        ) : filtered.length === 0 ? (
          <div className="card" style={{ textAlign:'center', padding:'4rem' }}>
            <p style={{ fontSize:'2.5rem' }}>📭</p>
            <p style={{ color:'#64748b', marginTop:8 }}>No complaints found</p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {filtered.map(c => (
              <div key={c._id} className="card fade-in" style={{ padding:'1.25rem', cursor:'pointer', transition:'all 0.2s', border:'1px solid rgba(30, 58, 138, 0.1)' }}
                onClick={() => setSelected(selected?._id === c._id ? null : c)}
                onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(79,70,229,0.4)'}
                onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(30, 58, 138, 0.1)'}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:12, flexWrap:'wrap' }}>
                  <span style={{ fontSize:'1.75rem', flexShrink:0, marginTop:2 }}>{CATEGORY_ICONS[c.issueCategory]}</span>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:4 }}>
                      <h3 style={{ fontWeight:700, color:'#0f172a', fontSize:'0.95rem' }}>{c.title}</h3>
                      <StatusBadge status={c.status} />
                    </div>
                    <p style={{ color:'#64748b', fontSize:'0.8rem', marginBottom:6, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{c.description}</p>
                    <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
                      <span style={{ fontSize:'0.75rem', color:'#94a3b8', display:'flex', alignItems:'center', gap:4 }}>
                        <Calendar size={12} /> {new Date(c.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                      </span>
                      {c.ward && <span style={{ fontSize:'0.75rem', color:'#94a3b8', display:'flex', alignItems:'center', gap:4 }}>
                        <MapPin size={12} /> Ward {c.ward.wardNumber}
                      </span>}
                      {c.image && <span style={{ fontSize:'0.75rem', color:'#94a3b8', display:'flex', alignItems:'center', gap:4 }}><ImageIcon size={12} /> Photo attached</span>}
                    </div>
                  </div>
                </div>

                {/* Expanded Detail */}
                {selected?._id === c._id && (
                  <div style={{ marginTop:'1rem', paddingTop:'1rem', borderTop:'1px solid #ffffff', display:'flex', flexDirection:'column', gap:10 }}>
                    {c.image && <img src={c.image} alt="complaint" style={{ maxHeight:200, objectFit:'cover', borderRadius:10, border:'1px solid #334155' }} />}
                    {c.location?.address && <p style={{ fontSize:'0.8rem', color:'#94a3b8' }}>📍 {c.location.address}</p>}
                    {c.adminNote && <div style={{ background:'rgba(6,182,212,0.1)', border:'1px solid rgba(6,182,212,0.2)', borderRadius:8, padding:'0.75rem', fontSize:'0.82rem', color:'#67e8f9' }}>
                      <strong>Admin Note:</strong> {c.adminNote}
                    </div>}
                    {c.resolvedAt && <p style={{ fontSize:'0.78rem', color:'#10b981' }}>✅ Resolved on {new Date(c.resolvedAt).toLocaleDateString('en-IN')}</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintHistory;

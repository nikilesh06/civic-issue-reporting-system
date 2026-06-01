import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Search, X, User, MapPin } from 'lucide-react';

const CATEGORY_ICONS = { Garbage:'🗑️', 'Road Damage':'🛣️', 'Water Leakage':'💧', Drainage:'🚰', Streetlight:'💡', Others:'📋' };

const ComplaintManagement = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [wardFilter, setWardFilter] = useState('');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [adminNote, setAdminNote] = useState('');

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 100 });
      if (statusFilter) params.append('status', statusFilter);
      if (wardFilter) params.append('ward', wardFilter);
      const { data } = await api.get(`/complaints?${params}`);
      setComplaints(data.complaints || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchComplaints(); }, [statusFilter, wardFilter]);
  useEffect(() => { api.get('/wards').then(({ data }) => setWards(data)); }, []);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      const { data } = await api.patch(`/complaints/${id}/status`, { status, adminNote });
      setComplaints(prev => prev.map(c => c._id === id ? data : c));
      if (modal?._id === id) setModal(data);
      setAdminNote('');
    } catch (e) { console.error(e); }
    finally { setUpdatingId(null); }
  };

  const filtered = complaints.filter(c =>
    c.title?.toLowerCase().includes(search.toLowerCase()) ||
    c.userId?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ background:'#f0f4f8', minHeight:'100vh' }}>
      <Navbar />
      <div style={{ display:'flex' }}>
        <Sidebar />
        <main className="admin-page-body" style={{ flex:1, padding:'2rem 1.5rem', minWidth:0 }}>
          <div className="fade-in" style={{ marginBottom:'1.5rem' }}>
            <h1 style={{ fontSize:'1.5rem', fontWeight:800, color:'#0f172a' }}>Complaint Management</h1>
            <p style={{ color:'#64748b', fontSize:'0.875rem', marginTop:4 }}>View and manage all civic complaints</p>
          </div>

          <div style={{ display:'flex', gap:10, marginBottom:'1.5rem', flexWrap:'wrap' }}>
            <div style={{ position:'relative', flex:1, minWidth:180 }}>
              <Search size={14} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#64748b' }} />
              <input className="input" placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} style={{ paddingLeft:32 }} />
            </div>
            <select className="select" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} style={{ width:'auto', minWidth:140 }}>
              <option value="">All Status</option>
              <option>Pending</option><option>In Progress</option><option>Resolved</option>
            </select>
            {user?.role === 'admin' && (
              <select className="select" value={wardFilter} onChange={e=>setWardFilter(e.target.value)} style={{ width:'auto', minWidth:150 }}>
                <option value="">All Wards</option>
                {wards.map(w => <option key={w._id} value={w._id}>Ward {w.wardNumber} — {w.wardName}</option>)}
              </select>
            )}
          </div>

          <div className="card" style={{ padding:'1.25rem' }}>
            <p style={{ fontSize:'0.8rem', color:'#64748b', marginBottom:'1rem' }}>{filtered.length} complaint(s) found</p>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Issue</th><th>Citizen</th><th>Category</th><th>Ward</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={7} style={{ textAlign:'center', color:'#64748b', padding:'2rem' }}>Loading...</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={7} style={{ textAlign:'center', color:'#64748b', padding:'2rem' }}>No complaints found</td></tr>
                  ) : filtered.map(c => (
                    <tr key={c._id}>
                      <td style={{ maxWidth:160 }}>
                        <span style={{ display:'block', fontWeight:600, color:'#2563eb', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', cursor:'pointer' }}
                          onClick={() => { setModal(c); setAdminNote(c.adminNote || ''); }}>{c.title}</span>
                      </td>
                      <td style={{ color:'#94a3b8', fontSize:'0.82rem' }}>{c.userId?.name || 'N/A'}</td>
                      <td>{CATEGORY_ICONS[c.issueCategory]} {c.issueCategory}</td>
                      <td style={{ color:'#94a3b8', fontSize:'0.82rem' }}>Ward {c.ward?.wardNumber}</td>
                      <td><StatusBadge status={c.status} /></td>
                      <td style={{ color:'#64748b', fontSize:'0.8rem' }}>{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
                      <td>
                        <div style={{ display:'flex', gap:6 }}>
                          {user?.role === 'councillor' && c.status !== 'In Progress' && (
                            <button onClick={() => updateStatus(c._id, 'In Progress')} disabled={updatingId === c._id}
                              style={{ background:'rgba(6,182,212,0.15)', border:'1px solid rgba(6,182,212,0.3)', borderRadius:6, padding:'4px 8px', color:'#0284c7', cursor:'pointer', fontSize:'0.75rem', fontWeight:600 }}>
                              Progress
                            </button>
                          )}
                          {user?.role === 'councillor' && c.status !== 'Resolved' && (
                            <button onClick={() => updateStatus(c._id, 'Resolved')} disabled={updatingId === c._id}
                              style={{ background:'rgba(16,185,129,0.15)', border:'1px solid rgba(16,185,129,0.3)', borderRadius:6, padding:'4px 8px', color:'#10b981', cursor:'pointer', fontSize:'0.75rem', fontWeight:600 }}>
                              Resolve
                            </button>
                          )}
                          {user?.role === 'admin' && (
                            <button
                              onClick={() => { setModal(c); setAdminNote(c.adminNote || ''); }}
                              style={{
                                background:'rgba(30,58,138,0.1)', border:'1px solid rgba(30,58,138,0.3)',
                                borderRadius:6, padding:'4px 10px', color:'#1e3a8a',
                                cursor:'pointer', fontSize:'0.75rem', fontWeight:600
                              }}>
                              View Details
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {modal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }} onClick={() => setModal(null)}>
          <div className="card" style={{ maxWidth:520, width:'100%', padding:'1.75rem', maxHeight:'88vh', overflowY:'auto' }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1rem' }}>
              <div>
                <span style={{ fontSize:'1.5rem' }}>{CATEGORY_ICONS[modal.issueCategory]}</span>
                <h2 style={{ fontSize:'1.05rem', fontWeight:700, color:'#0f172a', marginTop:4 }}>{modal.title}</h2>
              </div>
              <button onClick={() => setModal(null)} style={{ background:'none', border:'none', color:'#64748b', cursor:'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ display:'flex', gap:8, marginBottom:'1rem', flexWrap:'wrap', alignItems:'center' }}>
              <StatusBadge status={modal.status} />
              <span style={{ fontSize:'0.78rem', color:'#64748b', display:'flex', alignItems:'center', gap:4 }}><User size={12} /> {modal.userId?.name}</span>
              <span style={{ fontSize:'0.78rem', color:'#64748b', display:'flex', alignItems:'center', gap:4 }}><MapPin size={12} /> Ward {modal.ward?.wardNumber} — {modal.ward?.wardName}</span>
            </div>
            <p style={{ color:'#94a3b8', fontSize:'0.875rem', lineHeight:1.6, marginBottom:'1rem' }}>{modal.description}</p>
            {modal.location?.address && <p style={{ fontSize:'0.8rem', color:'#64748b', marginBottom:'0.75rem', display:'flex', alignItems:'center', gap:6 }}><MapPin size={13} /> {modal.location.address}</p>}
            {modal.image && <img src={modal.image} alt="complaint" style={{ width:'100%', maxHeight:200, objectFit:'cover', borderRadius:10, marginBottom:'1rem', border:'1px solid #334155' }} />}
            <div style={{ borderTop:'1px solid #334155', paddingTop:'1rem' }}>
              <label className="label">Admin Note</label>
              <textarea className="input" rows={2} value={adminNote} onChange={e=>setAdminNote(e.target.value)} placeholder="Add note for citizen..." style={{ marginBottom:'0.75rem', resize:'vertical' }} />
              <div style={{ display:'flex', gap:8 }}>
                {user?.role === 'councillor' ? (
                  <>
                    <button onClick={() => updateStatus(modal._id, 'In Progress')} disabled={modal.status === 'In Progress' || updatingId === modal._id}
                      className="btn-secondary" style={{ flex:1, justifyContent:'center', fontSize:'0.85rem' }}>Mark In Progress</button>
                    <button onClick={() => updateStatus(modal._id, 'Resolved')} disabled={modal.status === 'Resolved' || updatingId === modal._id}
                      className="btn-primary" style={{ flex:1, justifyContent:'center', fontSize:'0.85rem' }}>Mark Resolved</button>
                  </>
                ) : (
                  <button onClick={() => updateStatus(modal._id, modal.status)} disabled={updatingId === modal._id}
                    className="btn-primary" style={{ flex:1, justifyContent:'center', fontSize:'0.85rem' }}>Save Admin Note</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintManagement;

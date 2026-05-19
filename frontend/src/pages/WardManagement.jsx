import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';
import { Plus, Pencil, Trash2, X, MapPin } from 'lucide-react';

const emptyForm = { wardNumber: '', wardName: '', councillorName: '', councillorEmail: '', councillorPhone: '', area: '' };

const WardManagement = () => {
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'add' | ward object
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchWards = async () => {
    try {
      const { data } = await api.get('/wards');
      setWards(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchWards(); }, []);

  const openAdd = () => { setForm(emptyForm); setError(''); setModal('add'); };
  const openEdit = (w) => { setForm({ wardNumber: w.wardNumber, wardName: w.wardName, councillorName: w.councillorName, councillorEmail: w.councillorEmail || '', councillorPhone: w.councillorPhone || '', area: w.area || '' }); setError(''); setModal(w); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      if (modal === 'add') {
        const { data } = await api.post('/wards', form);
        setWards(prev => [...prev, data]);
      } else {
        const { data } = await api.put(`/wards/${modal._id}`, form);
        setWards(prev => prev.map(w => w._id === modal._id ? data : w));
      }
      setModal(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save ward');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this ward?')) return;
    try {
      await api.delete(`/wards/${id}`);
      setWards(prev => prev.filter(w => w._id !== id));
    } catch (e) { console.error(e); }
  };

  return (
    <div style={{ background: '#f0f4f8', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '2rem 1.5rem', minWidth: 0 }}>
          <div className="fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>Ward Management</h1>
              <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: 4 }}>Manage wards and their councillors</p>
            </div>
            <button className="btn-primary" onClick={openAdd}><Plus size={16} /> Add Ward</button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1rem' }}>
              {wards.map(w => (
                <div key={w._id} className="card fade-in" style={{ padding: '1.5rem', transition: 'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(79,70,229,0.4)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)'}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg,#1e3a8a,#0284c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <MapPin size={18} color="white" />
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>{w.wardName}</p>
                        <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Ward #{w.wardNumber}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => openEdit(w)} style={{ background: 'rgba(30, 58, 138, 0.05)', border: '1px solid rgba(30, 58, 138, 0.15)', borderRadius: 7, padding: '5px 8px', color: '#2563eb', cursor: 'pointer' }}><Pencil size={13} /></button>
                      <button onClick={() => handleDelete(w._id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 7, padding: '5px 8px', color: '#f87171', cursor: 'pointer' }}><Trash2 size={13} /></button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', width: 80 }}>Councillor</span>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>{w.councillorName}</span>
                    </div>
                    {w.councillorEmail && <div style={{ display: 'flex', gap: 8 }}>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', width: 80 }}>Email</span>
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{w.councillorEmail}</span>
                    </div>}
                    {w.councillorPhone && <div style={{ display: 'flex', gap: 8 }}>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', width: 80 }}>Phone</span>
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{w.councillorPhone}</span>
                    </div>}
                    {w.area && <div style={{ display: 'flex', gap: 8 }}>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', width: 80 }}>Area</span>
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{w.area}</span>
                    </div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Add/Edit Modal */}
      {modal !== null && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setModal(null)}>
          <div className="card" style={{ maxWidth: 480, width: '100%', padding: '1.75rem' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>{modal === 'add' ? 'Add New Ward' : 'Edit Ward'}</h2>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '0.65rem 1rem', color: '#f87171', fontSize: '0.83rem', marginBottom: '1rem' }}>{error}</div>}
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="label">Ward Number *</label>
                  <input className="input" type="number" value={form.wardNumber} onChange={e => setForm({ ...form, wardNumber: e.target.value })} required />
                </div>
                <div>
                  <label className="label">Ward Name *</label>
                  <input className="input" type="text" value={form.wardName} onChange={e => setForm({ ...form, wardName: e.target.value })} required />
                </div>
              </div>
              <div>
                <label className="label">Councillor Name *</label>
                <input className="input" type="text" value={form.councillorName} onChange={e => setForm({ ...form, councillorName: e.target.value })} required />
              </div>
              <div>
                <label className="label">Councillor Email</label>
                <input className="input" type="email" value={form.councillorEmail} onChange={e => setForm({ ...form, councillorEmail: e.target.value })} />
              </div>
              <div>
                <label className="label">Councillor Phone</label>
                <input className="input" type="text" value={form.councillorPhone} onChange={e => setForm({ ...form, councillorPhone: e.target.value })} />
              </div>
              <div>
                <label className="label">Area / Zone</label>
                <input className="input" type="text" value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button type="button" className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setModal(null)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving} style={{ flex: 1, justifyContent: 'center' }}>
                  {saving ? 'Saving...' : modal === 'add' ? 'Add Ward' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WardManagement;

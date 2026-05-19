import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import LocationPicker from '../components/LocationPicker';
import api from '../api/axios';
import { Upload, X, CheckCircle, Loader, AlertCircle } from 'lucide-react';

const CATEGORIES = ['Garbage', 'Road Damage', 'Water Leakage', 'Drainage', 'Streetlight', 'Others'];
const CATEGORY_ICONS = { Garbage:'🗑️', 'Road Damage':'🛣️', 'Water Leakage':'💧', Drainage:'🚰', Streetlight:'💡', Others:'📋' };

const SubmitComplaint = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [wards, setWards] = useState([]);
  const [form, setForm] = useState({
    title: '', description: '', issueCategory: '', ward: user?.ward?._id || user?.ward || '',
  });
  const [location, setLocation] = useState(null);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api.get('/wards').then(({ data }) => setWards(data)).catch(console.error);
  }, []);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError('Image must be < 5MB'); return; }
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.issueCategory || !form.ward) {
      return setError('Please fill all required fields');
    }
    setError(''); setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append('image', image);
      if (location) { fd.append('lat', location.lat); fd.append('lng', location.lng); fd.append('address', location.address); }

      // Save ward to profile if changed
      if (form.ward !== (user?.ward?._id || user?.ward)) {
        const { data } = await api.put('/auth/profile', { ward: form.ward });
        updateUser(data);
      }

      await api.post('/complaints', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccess(true);
      setTimeout(() => navigate('/history'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed');
    } finally { setLoading(false); }
  };

  if (success) return (
    <div style={{ minHeight:'100vh', background:'#f0f4f8', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center' }}>
        <CheckCircle size={64} color="#10b981" style={{ margin:'0 auto 1rem' }} />
        <h2 style={{ color:'#0f172a', fontSize:'1.4rem', fontWeight:700 }}>Complaint Submitted!</h2>
        <p style={{ color:'#64748b', marginTop:8 }}>Redirecting to your complaint history...</p>
      </div>
    </div>
  );

  return (
    <div style={{ background:'#f0f4f8', minHeight:'100vh' }}>
      <Navbar />
      <div style={{ maxWidth:800, margin:'0 auto', padding:'2rem 1.5rem' }}>
        <div className="fade-in" style={{ marginBottom:'1.5rem' }}>
          <h1 style={{ fontSize:'1.5rem', fontWeight:800, color:'#0f172a' }}>Report an Issue</h1>
          <p style={{ color:'#64748b', fontSize:'0.875rem', marginTop:4 }}>Help your community by reporting civic issues</p>
        </div>

        {error && (
          <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:10, padding:'0.75rem 1rem', color:'#f87171', fontSize:'0.85rem', marginBottom:'1.25rem', display:'flex', alignItems:'center', gap:8 }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="card" style={{ padding:'2rem', display:'flex', flexDirection:'column', gap:'1.25rem' }}>
          {/* Ward */}
          <div>
            <label className="label">Ward <span style={{color:'#ef4444'}}>*</span></label>
            <select className="select" value={form.ward} onChange={e => setForm({...form, ward: e.target.value})} required>
              <option value="">Select your ward</option>
              {wards.map(w => <option key={w._id} value={w._id}>Ward {w.wardNumber} — {w.wardName}</option>)}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="label">Issue Category <span style={{color:'#ef4444'}}>*</span></label>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))', gap:8 }}>
              {CATEGORIES.map(cat => (
                <button key={cat} type="button" onClick={() => setForm({...form, issueCategory: cat})}
                  style={{
                    padding:'0.6rem 0.75rem', borderRadius:10, border:'1px solid',
                    borderColor: form.issueCategory === cat ? '#1e3a8a' : '#334155',
                    background: form.issueCategory === cat ? 'rgba(30, 58, 138, 0.1)' : 'rgba(15,23,42,0.5)',
                    color: form.issueCategory === cat ? '#2563eb' : '#94a3b8',
                    cursor:'pointer', fontSize:'0.82rem', fontWeight:500, transition:'all 0.2s',
                    display:'flex', alignItems:'center', gap:6,
                  }}>
                  {CATEGORY_ICONS[cat]} {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="label">Issue Title <span style={{color:'#ef4444'}}>*</span></label>
            <input className="input" type="text" placeholder="Brief title of the issue" value={form.title}
              onChange={e => setForm({...form, title: e.target.value})} required />
          </div>

          {/* Description */}
          <div>
            <label className="label">Description <span style={{color:'#ef4444'}}>*</span></label>
            <textarea className="input" rows={4} placeholder="Describe the issue in detail..."
              value={form.description} onChange={e => setForm({...form, description: e.target.value})}
              required style={{ resize:'vertical' }} />
          </div>

          {/* Image Upload */}
          <div>
            <label className="label">Upload Image (optional)</label>
            {preview ? (
              <div style={{ position:'relative', display:'inline-block' }}>
                <img src={preview} alt="preview" style={{ width:'100%', maxHeight:220, objectFit:'cover', borderRadius:12, border:'1px solid #334155' }} />
                <button type="button" onClick={() => { setImage(null); setPreview(null); }}
                  style={{ position:'absolute', top:8, right:8, background:'rgba(239,68,68,0.8)', border:'none', borderRadius:'50%', width:28, height:28, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <X size={14} color="white" />
                </button>
              </div>
            ) : (
              <label style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8, padding:'1.5rem', borderRadius:12, border:'2px dashed #334155', cursor:'pointer', transition:'border-color 0.2s' }}
                onMouseEnter={e=>e.currentTarget.style.borderColor='#1e3a8a'} onMouseLeave={e=>e.currentTarget.style.borderColor='#334155'}>
                <Upload size={28} color="#64748b" />
                <span style={{ color:'#64748b', fontSize:'0.875rem' }}>Click to upload (max 5MB)</span>
                <input type="file" accept="image/*" onChange={handleImage} style={{ display:'none' }} />
              </label>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="label">Issue Location</label>
            {location && <p style={{ fontSize:'0.78rem', color:'#10b981', marginBottom:6 }}>📍 {location.address}</p>}
            <LocationPicker lat={location?.lat} lng={location?.lng} onLocationSelect={setLocation} />
          </div>

          <button className="btn-primary" type="submit" disabled={loading} style={{ width:'100%', justifyContent:'center', padding:'0.875rem', fontSize:'1rem' }}>
            {loading ? <><Loader size={18} style={{ animation:'spin 0.8s linear infinite' }} /> Submitting...</> : '📤 Submit Complaint'}
          </button>
        </form>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

export default SubmitComplaint;

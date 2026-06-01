import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Mail, ArrowRight, Loader } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [ward, setWard] = useState('');
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/wards').then(({ data }) => setWards(data)).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return setError('Please enter your email');
    if (!ward) return setError('Please select your ward');
    setError(''); setLoading(true);
    try {
      await api.post('/auth/send-otp', { email, name, ward });
      navigate('/verify-otp', { state: { email, name } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', background:'#f0f4f8', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem', position:'relative', overflow:'hidden' }}>
      {/* Decorative background gradients */}
      <div style={{ position:'absolute', top:'-10%', left:'-5%', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(79,70,229,0.15), transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'-10%', right:'-5%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, rgba(6,182,212,0.1), transparent 70%)', pointerEvents:'none' }} />

      <div className="card fade-in" style={{ width:'100%', maxWidth:440, padding:'2.5rem' }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <div className="pulse" style={{ width:64, height:64, borderRadius:18, background:'linear-gradient(135deg,#1e3a8a,#0284c7)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1rem' }}>
            <MapPin size={28} color="white" />
          </div>
          <h1 style={{ fontSize:'1.6rem', fontWeight:800, marginBottom:6 }}>
            <span className="gradient-text">CivicReport</span>
          </h1>
          <p style={{ color:'#94a3b8', fontSize:'0.9rem' }}>Crowdsourced Civic Issue Reporting</p>
        </div>

        <h2 style={{ fontSize:'1.1rem', fontWeight:600, color:'#0f172a', marginBottom:'0.25rem' }}>{t('welcome')}</h2>
        <p style={{ color:'#64748b', fontSize:'0.85rem', marginBottom:'1.5rem' }}>Sign in with your email — we'll send an OTP</p>

        {error && (
          <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:10, padding:'0.75rem 1rem', color:'#f87171', fontSize:'0.85rem', marginBottom:'1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          <div>
            <label className="label">Full Name</label>
            <input className="input" type="text" placeholder={t('enter_name')} value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="label">{t('email')}</label>
            <div style={{ position:'relative' }}>
              <Mail size={16} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#64748b' }} />
              <input className="input" type="email" placeholder={t('enter_email')} value={email}
                onChange={e => setEmail(e.target.value)} style={{ paddingLeft:36 }} required />
            </div>
          </div>
          <div>
            <label className="label">{t('ward')}</label>
            <select className="select" value={ward} onChange={e => setWard(e.target.value)} required>
              <option value="">{t('select_ward')}</option>
              {wards.map(w => <option key={w._id} value={w._id}>Ward {w.wardNumber} — {w.wardName}</option>)}
            </select>
          </div>
          <button className="btn-primary" type="submit" disabled={loading} style={{ width:'100%', justifyContent:'center', padding:'0.75rem' }}>
            {loading ? <><Loader size={16} style={{ animation:'spin 0.8s linear infinite' }} /> Sending OTP...</> : <>{t('send_otp')} <ArrowRight size={16} /></>}
          </button>
        </form>

        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );
};

export default Login;

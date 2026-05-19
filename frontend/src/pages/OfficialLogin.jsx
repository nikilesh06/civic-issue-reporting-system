import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Mail, ArrowRight, Loader } from 'lucide-react';
import api from '../api/axios';

const OfficialLogin = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return setError('Please enter your email');
    setError(''); setLoading(true);
    try {
      // Pass isOfficialMode to bypass citizen requirements and ensure role check
      await api.post('/auth/send-otp', { email, isOfficialMode: true });
      navigate('/verify-otp', { state: { email } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f0f4f8', padding:'1rem' }}>
      <div className="card fade-in" style={{ maxWidth:400, width:'100%', padding:'2rem', borderTop:'4px solid #1e3a8a' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:'2rem' }}>
          <div style={{ width:40, height:40, borderRadius:12, background:'linear-gradient(135deg, #1e3a8a, #0284c7)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <MapPin color="white" size={20} />
          </div>
          <h1 style={{ fontSize:'1.4rem', fontWeight:800, color:'#0f172a', letterSpacing:'-0.5px' }}>Official Login</h1>
        </div>

        <h2 style={{ fontSize:'1.1rem', fontWeight:600, color:'#0f172a', marginBottom:'0.25rem' }}>Welcome back</h2>
        <p style={{ color:'#64748b', fontSize:'0.85rem', marginBottom:'1.5rem' }}>Sign in to access your administrative dashboard.</p>

        {error && (
          <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:10, padding:'0.75rem 1rem', color:'#f87171', fontSize:'0.85rem', marginBottom:'1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          <div>
            <label className="label">Official Email Address</label>
            <div style={{ position:'relative' }}>
              <Mail size={16} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#64748b' }} />
              <input className="input" type="email" placeholder="you@civic.gov" value={email}
                onChange={e => setEmail(e.target.value)} style={{ paddingLeft:36 }} required />
            </div>
          </div>
          <button className="btn-primary" type="submit" disabled={loading} style={{ width:'100%', justifyContent:'center', padding:'0.75rem', marginTop:'0.5rem' }}>
            {loading ? <><Loader size={16} style={{ animation:'spin 0.8s linear infinite' }} /> Sending OTP...</> : <>Send OTP <ArrowRight size={16} /></>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OfficialLogin;

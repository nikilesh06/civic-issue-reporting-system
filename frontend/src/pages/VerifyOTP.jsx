import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Loader, RefreshCw } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const VerifyOTP = () => {
  const { t } = useTranslation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const refs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { email, name } = location.state || {};

  const handleChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (paste.length === 6) {
      setOtp(paste.split(''));
      refs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) return setError('Enter all 6 digits');
    setError(''); setLoading(true);
    try {
      const { data } = await api.post('/auth/verify-otp', { email, otp: code });
      login(data.user, data.token);
      navigate(data.user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
      setOtp(['', '', '', '', '', '']);
      refs.current[0]?.focus();
    } finally { setLoading(false); }
  };

  const resendOTP = async () => {
    setResending(true); setError(''); setSuccess('');
    try {
      await api.post('/auth/send-otp', { email, name });
      setSuccess('New OTP sent!');
      setOtp(['', '', '', '', '', '']);
      refs.current[0]?.focus();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend');
    } finally { setResending(false); }
  };

  if (!email) { navigate('/login'); return null; }

  return (
    <div style={{ minHeight:'100vh', background:'#f0f4f8', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:'-10%', right:'-5%', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(6,182,212,0.12), transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'-10%', left:'-5%', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(79,70,229,0.12), transparent 70%)', pointerEvents:'none' }} />

      <div className="card fade-in" style={{ width:'100%', maxWidth:420, padding:'2.5rem', textAlign:'center' }}>
        <div style={{ width:64, height:64, borderRadius:18, background:'linear-gradient(135deg,#10b981,#0284c7)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1.5rem' }}>
          <ShieldCheck size={28} color="white" />
        </div>
        <h1 style={{ fontSize:'1.5rem', fontWeight:800, color:'#0f172a', marginBottom:8 }}>{t('verify_otp')}</h1>
        <p style={{ color:'#94a3b8', fontSize:'0.875rem', marginBottom:'0.25rem' }}>Enter the 6-digit code sent to</p>
        <p style={{ color:'#2563eb', fontWeight:600, fontSize:'0.9rem', marginBottom:'2rem' }}>{email}</p>

        {error && <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:10, padding:'0.75rem', color:'#f87171', fontSize:'0.85rem', marginBottom:'1rem' }}>{error}</div>}
        {success && <div style={{ background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.3)', borderRadius:10, padding:'0.75rem', color:'#34d399', fontSize:'0.85rem', marginBottom:'1rem' }}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ display:'flex', gap:8, justifyContent:'center', marginBottom:'1.5rem' }} onPaste={handlePaste}>
            {otp.map((d, i) => (
              <input key={i} ref={el => refs.current[i] = el} className="otp-input"
                type="text" inputMode="numeric" maxLength={1} value={d}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)} />
            ))}
          </div>
          <button className="btn-primary" type="submit" disabled={loading} style={{ width:'100%', justifyContent:'center', padding:'0.75rem' }}>
            {loading ? <><Loader size={16} style={{ animation:'spin 0.8s linear infinite' }} /> Verifying...</> : 'Verify & Sign In'}
          </button>
        </form>

        <button onClick={resendOTP} disabled={resending} style={{
          marginTop:'1rem', background:'none', border:'none', color:'#64748b',
          cursor:'pointer', fontSize:'0.85rem', display:'flex', alignItems:'center', gap:6, margin:'1rem auto 0',
        }}>
          <RefreshCw size={14} style={{ animation: resending ? 'spin 0.8s linear infinite' : 'none' }} />
          {resending ? 'Resending...' : "Didn't receive OTP? Resend"}
        </button>
        <button onClick={() => navigate('/login')} style={{ marginTop:8, background:'none', border:'none', color:'#94a3b8', cursor:'pointer', fontSize:'0.8rem' }}>
          ← {t('back_to_login')}
        </button>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );
};

export default VerifyOTP;

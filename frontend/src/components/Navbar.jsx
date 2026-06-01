import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Bell, User, MapPin, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ta' : 'en';
    i18n.changeLanguage(newLang);
  };

  const isOfficial = user?.role === 'admin' || user?.role === 'councillor';
  const handleLogout = () => {
    navigate(isOfficial ? '/official-login' : '/login', { replace: true });
    logout();
  };

  return (
    <nav style={{
      background: '#1e3a8a',
      borderBottom: '2px solid #1e40af',
      padding: '0 1rem',
      height: 64,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <Link to={user?.role === 'admin' || user?.role === 'councillor' ? '/admin' : '/'} style={{ textDecoration:'none', display:'flex', alignItems:'center', gap: 10 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 8,
          background: '#ffffff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <MapPin size={20} color="#1e3a8a" />
        </div>
        <span className="navbar-title" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', letterSpacing: '0.02em' }}>
          {t('app_title')}
        </span>
      </Link>

      <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {user?.role === 'citizen' && (
          <Link to="/submit" style={{ textDecoration:'none' }}>
            <button style={{ 
              background: '#0ea5e9', color: '#ffffff', border: 'none', 
              padding: '0.45rem 1rem', borderRadius: 6, fontSize: '0.82rem', fontWeight: 600,
            }} onMouseEnter={e=>e.currentTarget.style.background='#0284c7'} onMouseLeave={e=>e.currentTarget.style.background='#0ea5e9'}>
              {t('submit_complaint')}
            </button>
          </Link>
        )}
        <div style={{ display:'flex', alignItems:'center', gap: 8,
          background:'rgba(255, 255, 255, 0.1)', borderRadius: 6, padding:'5px 10px',
          border:'1px solid rgba(255, 255, 255, 0.2)' }}>
          <div style={{ width:26, height:26, borderRadius:'50%',
            background:'#ffffff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <User size={14} color="#1e3a8a" />
          </div>
          <div>
            <p className="navbar-user-name" style={{ fontSize:'0.8rem', fontWeight:600, color:'#ffffff', lineHeight:1 }}>{user?.name}</p>
            <p style={{ fontSize:'0.65rem', color:'#bfdbfe', lineHeight:1.4, textTransform:'uppercase', letterSpacing: '0.05em' }}>{user?.role}</p>
          </div>
        </div>
        <button onClick={toggleLanguage} style={{
          background:'transparent', border:'1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: 6, padding:'5px 8px', cursor:'pointer',
          display:'flex', alignItems:'center', gap: 4, color:'#ffffff', fontSize:'0.82rem',
          fontWeight: 500, transition:'all 0.2s',
        }} onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.1)'}}
           onMouseLeave={e=>{e.currentTarget.style.background='transparent'}}>
          <Globe size={14} /> {i18n.language === 'en' ? 'தமிழ்' : 'EN'}
        </button>

        <button onClick={handleLogout} style={{
          background:'transparent', border:'1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: 6, padding:'5px 10px', cursor:'pointer',
          display:'flex', alignItems:'center', gap: 5, color:'#ffffff', fontSize:'0.82rem',
          fontWeight: 500, transition:'all 0.2s',
        }} onMouseEnter={e=>{e.currentTarget.style.background='#dc2626'; e.currentTarget.style.borderColor='#dc2626'}}
           onMouseLeave={e=>{e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='rgba(255, 255, 255, 0.3)'}}>
          <LogOut size={14} /> <span className="navbar-user-name">{t('logout')}</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

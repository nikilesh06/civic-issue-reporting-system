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
      padding: '0 2rem',
      height: 64,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <Link to={user?.role === 'admin' ? '/admin' : '/'} style={{ textDecoration:'none', display:'flex', alignItems:'center', gap: 12 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 4,
          background: '#ffffff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <MapPin size={20} color="#1e3a8a" />
        </div>
        <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', letterSpacing: '0.02em' }}>
          {t('app_title')}
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        {user?.role === 'citizen' && (
          <Link to="/submit" style={{ textDecoration:'none' }}>
            <button style={{ 
              background: '#0ea5e9', color: '#ffffff', border: 'none', 
              padding: '0.5rem 1.25rem', borderRadius: 4, fontSize: '0.85rem', fontWeight: 600,
            }} onMouseEnter={e=>e.currentTarget.style.background='#0284c7'} onMouseLeave={e=>e.currentTarget.style.background='#0ea5e9'}>
              {t('submit_complaint')}
            </button>
          </Link>
        )}
        <div style={{ display:'flex', alignItems:'center', gap: 10,
          background:'rgba(255, 255, 255, 0.1)', borderRadius: 4, padding:'6px 12px',
          border:'1px solid rgba(255, 255, 255, 0.2)' }}>
          <div style={{ width:28, height:28, borderRadius:'50%',
            background:'#ffffff', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <User size={16} color="#1e3a8a" />
          </div>
          <div>
            <p style={{ fontSize:'0.8rem', fontWeight:600, color:'#ffffff', lineHeight:1 }}>{user?.name}</p>
            <p style={{ fontSize:'0.7rem', color:'#bfdbfe', lineHeight:1.4, textTransform:'uppercase', letterSpacing: '0.05em' }}>{user?.role}</p>
          </div>
        </div>
        <button onClick={toggleLanguage} style={{
          background:'transparent', border:'1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: 4, padding:'6px 10px', cursor:'pointer',
          display:'flex', alignItems:'center', gap: 6, color:'#ffffff', fontSize:'0.85rem',
          fontWeight: 500, transition:'all 0.2s',
        }} onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.1)'}}
           onMouseLeave={e=>{e.currentTarget.style.background='transparent'}}>
          <Globe size={15} /> {i18n.language === 'en' ? 'தமிழ்' : 'English'}
        </button>

        <button onClick={handleLogout} style={{
          background:'transparent', border:'1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: 4, padding:'6px 12px', cursor:'pointer',
          display:'flex', alignItems:'center', gap: 6, color:'#ffffff', fontSize:'0.85rem',
          fontWeight: 500, transition:'all 0.2s',
        }} onMouseEnter={e=>{e.currentTarget.style.background='#dc2626'; e.currentTarget.style.borderColor='#dc2626'}}
           onMouseLeave={e=>{e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='rgba(255, 255, 255, 0.3)'}}>
          <LogOut size={15} /> {t('logout')}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

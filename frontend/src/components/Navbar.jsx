import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Bell, User, MapPin } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

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
          CivicReport Portal
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        {user?.role === 'citizen' && (
          <Link to="/submit" style={{ textDecoration:'none' }}>
            <button style={{ 
              background: '#0ea5e9', color: '#ffffff', border: 'none', 
              padding: '0.5rem 1.25rem', borderRadius: 4, fontSize: '0.85rem', fontWeight: 600,
              cursor: 'pointer', transition: 'background 0.2s'
            }} onMouseEnter={e=>e.currentTarget.style.background='#0284c7'} onMouseLeave={e=>e.currentTarget.style.background='#0ea5e9'}>
              + Report Issue
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
        <button onClick={handleLogout} style={{
          background:'transparent', border:'1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: 4, padding:'6px 12px', cursor:'pointer',
          display:'flex', alignItems:'center', gap: 6, color:'#ffffff', fontSize:'0.85rem',
          fontWeight: 500, transition:'all 0.2s',
        }} onMouseEnter={e=>{e.currentTarget.style.background='#dc2626'; e.currentTarget.style.borderColor='#dc2626'}}
           onMouseLeave={e=>{e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='rgba(255, 255, 255, 0.3)'}}>
          <LogOut size={15} /> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

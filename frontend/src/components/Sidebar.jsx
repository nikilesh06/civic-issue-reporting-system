import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, BarChart3, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/complaints', icon: FileText, label: 'Complaints' },
  { to: '/admin/wards', icon: MapPin, label: 'Wards', role: 'admin' },
];

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside style={{
      width: 240, minHeight: 'calc(100vh - 64px)',
      background: '#ffffff',
      borderRight: '1px solid #e2e8f0',
      padding: '1.5rem 0',
      display: 'flex', flexDirection: 'column', gap: 4,
      position: 'sticky', top: 64, height: 'calc(100vh - 64px)',
      overflowY: 'auto',
    }}>
      <p style={{ fontSize:'0.75rem', fontWeight:700, color:'#64748b', textTransform:'uppercase',
        letterSpacing:'0.08em', padding:'0 1.5rem', marginBottom:'0.75rem' }}>
        {user?.role === 'councillor' ? 'Councillor Panel' : 'Administration'}
      </p>
      {links.map(({ to, icon: Icon, label, end, role }) => {
        if (role && user?.role !== role) return null;
        
        return (
          <NavLink key={to} to={to} end={end} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '0.75rem 1.5rem', textDecoration: 'none',
            fontSize: '0.9rem', fontWeight: isActive ? 600 : 500, transition: 'all 0.2s',
            background: isActive ? '#eff6ff' : 'transparent',
            color: isActive ? '#1e3a8a' : '#475569',
            borderLeft: isActive ? '4px solid #1e3a8a' : '4px solid transparent',
          })}>
            {({ isActive }) => (
              <>
                <Icon size={18} style={{ color: isActive ? '#2563eb' : '#94a3b8' }} />
                {label}
              </>
            )}
          </NavLink>
        );
      })}
    </aside>
  );
};

export default Sidebar;

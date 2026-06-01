import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', color:'#0f172a' }}>Loading...</div>;

  if (!user) {
    // If the user was on an admin or official route, send them to official login
    if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/official-login')) {
      return <Navigate to="/official-login" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  if (role) {
    if (Array.isArray(role)) {
      if (!role.includes(user.role)) return <Navigate to={user.role === 'citizen' ? '/' : '/admin'} replace />;
    } else {
      if (user.role !== role) return <Navigate to={user.role === 'citizen' ? '/' : '/admin'} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', color:'#0f172a' }}>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

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

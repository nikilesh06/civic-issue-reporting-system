import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import VerifyOTP from './pages/VerifyOTP';
import CitizenDashboard from './pages/CitizenDashboard';
import SubmitComplaint from './pages/SubmitComplaint';
import ComplaintHistory from './pages/ComplaintHistory';
import AdminDashboard from './pages/AdminDashboard';
import ComplaintManagement from './pages/ComplaintManagement';
import WardManagement from './pages/WardManagement';
import OfficialLogin from './pages/OfficialLogin';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/official-login" element={<OfficialLogin />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />

          {/* Citizen Routes */}
          <Route path="/" element={<ProtectedRoute role="citizen"><CitizenDashboard /></ProtectedRoute>} />
          <Route path="/submit" element={<ProtectedRoute role="citizen"><SubmitComplaint /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute role="citizen"><ComplaintHistory /></ProtectedRoute>} />

          {/* Official Routes (Admin + Councillor) */}
          <Route path="/admin" element={<ProtectedRoute role={['admin', 'councillor']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/complaints" element={<ProtectedRoute role={['admin', 'councillor']}><ComplaintManagement /></ProtectedRoute>} />
          
          {/* Admin Only Routes */}
          <Route path="/admin/wards" element={<ProtectedRoute role="admin"><WardManagement /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

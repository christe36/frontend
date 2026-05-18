import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import LandingPage from './pages/auth/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ClientsPage from './pages/clients/ClientsPage';
import CommandesPage from './pages/commandes/CommandesPage';
import OuvriersPage from './pages/ouvriers/OuvriersPage';
import AgendaPage from './pages/agenda/AgendaPage';
import ParametresPage from './pages/parametres/ParametresPage';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{height:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{textAlign:'center'}}>
        <div className="spinner spinner-dark" style={{width:36,height:36,margin:'0 auto 12px'}} />
        <p style={{color:'var(--text-muted)',fontSize:14}}>Chargement...</p>
      </div>
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{
          style: { borderRadius:'10px', background:'#1A1A1A', color:'white', fontSize:'14px' },
          success: { iconTheme: { primary:'#C17F3A', secondary:'white' } },
        }} />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/clients" element={<PrivateRoute><ClientsPage /></PrivateRoute>} />
          <Route path="/commandes" element={<PrivateRoute><CommandesPage /></PrivateRoute>} />
          <Route path="/commandes/new" element={<PrivateRoute><CommandesPage /></PrivateRoute>} />
          <Route path="/ouvriers" element={<PrivateRoute><OuvriersPage /></PrivateRoute>} />
          <Route path="/agenda" element={<PrivateRoute><AgendaPage /></PrivateRoute>} />
          <Route path="/parametres" element={<PrivateRoute><ParametresPage /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

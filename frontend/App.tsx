
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SalesPage from './pages/SalesPage';
import { AuthContext } from './contexts/AuthContext';
import Notification from './components/common/Notification';
import { useNotification } from './hooks/useNotification';
import UsuariosForm from './components/usuarios/usuariosForm';
import OrigenDatoForm from './components/origenesDatos/origenDatosForm';
import AbonoForm from './components/abonos/abonosForm';
import TiposDomicilioForm from './components/tiposDomicilios/tipoDomicilio';
import Home from './components/home/home'
import ConsultaBbooForm from './components/ConsultaBboo/ConsultForm';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useContext(AuthContext);
  if (!auth?.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  const { notification } = useNotification();

  return (
    <div className="relative min-h-screen bg-gray-900">
      {notification && <Notification message={notification.message} type={notification.type} />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        >
          <Route path="sales" element={<SalesPage />} />
          <Route path="usuarios" element={<UsuariosForm />} />
          <Route path="origenes-datos" element={<OrigenDatoForm />} />
          <Route path="abonos" element={<AbonoForm />} />
          <Route path="tipos-domicilios" element={<TiposDomicilioForm />} />
          <Route path="consultas-bboo" element={<ConsultaBbooForm />} />
          
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
};

export default App;
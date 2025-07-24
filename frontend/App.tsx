
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // Removed HashRouter import
import LoginPage from './pages/LoginPage.js';
import SalesPage from './pages/SalesPage.js';
import { AuthContext } from './contexts/AuthContext.js';
import Notification from './components/common/Notification.js';
import { useNotification } from './hooks/useNotification.js';
import UsuariosForm from './components/usuarios/usuariosForm.js';
import OrigenDatoForm from './components/origenesDatos/origenDatosForm.js';

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
    // <HashRouter> Removed from here
    <div className="relative min-h-screen">
      {notification && <Notification message={notification.message} type={notification.type} />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/sales" 
          element={
            <ProtectedRoute>
              <SalesPage />
            </ProtectedRoute>
          } 
        />
        <Route path="/usuarios" element={<ProtectedRoute><UsuariosForm /></ProtectedRoute>} />
        <Route path="/origenes-datos" element={<ProtectedRoute><OrigenDatoForm /></ProtectedRoute>} />
        {/* Add more protected routes as needed */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
    // </HashRouter> Removed from here
  );
};

export default App;

import React, { useContext } from 'react';
import SalesForm from '../components/salesForm/SalesForm';
import { AuthContext } from '../contexts/AuthContext';
import Button from '../components/common/Button'; // Assuming Button component exists

const SalesPage: React.FC = () => {
  const auth = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text p-4 md:p-8">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-100">Formulario de Carga de Ventas</h1>
        {auth?.isAuthenticated && (
          <Button onClick={auth.logout} variant="secondary" className="text-sm py-2 px-4">
            Cerrar Sesión
          </Button>
        )}
      </header>
      <main>
        <SalesForm />
      </main>
    </div>
  );
};

export default SalesPage;
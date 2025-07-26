
import React from 'react';
import SalesForm from '../components/salesForm/SalesForm';

const SalesPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Formulario de Carga de Ventas</h1>
      <SalesForm />
    </div>
  );
};

export default SalesPage;
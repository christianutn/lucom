
import React from 'react';
import Card from '../../common/Card';
import InternetBafForm from '../businessTypes/InternetBafForm';
import PortabilidadForm from '../businessTypes/PortabilidadForm';
import ConsultaBbooForm from '../businessTypes/ConsultaBbooForm';
import { InternetBafState, PortabilidadState, Cliente } from '../../../types';

interface AdditionalSaleDataSectionProps {
  tipoNegocioId: string; // ID of the selected business type
  tipoNegocioDescripcion: string; // Description for title
  internetBafData: InternetBafState;
  onInternetBafChange: <K extends keyof InternetBafState>(field: K, value: InternetBafState[K]) => void;
  portabilidadData: PortabilidadState;
  onPortabilidadChange: <K extends keyof PortabilidadState>(field: K, value: PortabilidadState[K]) => void;
  selectedClient: Cliente | null;
}

const AdditionalSaleDataSection: React.FC<AdditionalSaleDataSectionProps> = ({
  tipoNegocioId,
  tipoNegocioDescripcion,
  internetBafData,
  onInternetBafChange,
  portabilidadData,
  onPortabilidadChange,
  selectedClient,
}) => {
  
  const renderFormBasedOnType = () => {
    // Note: IDs are numbers in mockData, but select value is string.
    switch (tipoNegocioId) {
      case "4": // Internet (BAF)
        return <InternetBafForm data={internetBafData} onChange={onInternetBafChange} />;
      case "1": // Portabilidad
        return <PortabilidadForm data={portabilidadData} onChange={onPortabilidadChange} selectedClient={selectedClient} />;
      case "3": // Consulta BBOO
        return <ConsultaBbooForm />;
      default:
        return <p className="text-gray-400">Seleccione un tipo de negocio para ver campos adicionales.</p>;
    }
  };

  const title = tipoNegocioDescripcion 
    ? `Datos Adicionales: ${tipoNegocioDescripcion}` 
    : "Datos Adicionales de la Venta";

  return (
    <Card title={title} className="mb-6">
      {renderFormBasedOnType()}
    </Card>
  );
};

export default AdditionalSaleDataSection;
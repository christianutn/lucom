import React from 'react';
import Card from '../../common/Card.js';
import InternetBafForm from '../businessTypes/InternetBafForm.js';
import PortabilidadForm from '../businessTypes/PortabilidadForm.js';
import ConsultaBbooForm from '../businessTypes/ConsultaBbooForm.js';
import { InternetBafState, PortabilidadState, Cliente, ConsultaBbooState } from '../../../types.js';

interface AdditionalSaleDataSectionProps {
  tipoNegocioId: string;
  tipoNegocioDescripcion: string;
  internetBafData: InternetBafState;
  onInternetBafChange: <K extends keyof InternetBafState>(field: K, value: InternetBafState[K]) => void;
  portabilidadData: PortabilidadState;
  onPortabilidadChange: <K extends keyof PortabilidadState>(field: K, value: PortabilidadState[K]) => void;
  selectedClient: Cliente | null;
  consultaBbooData: ConsultaBbooState;
  onConsultaBbooChange: <K extends keyof ConsultaBbooState>(field: K, value: ConsultaBbooState[K]) => void;
}

const AdditionalSaleDataSection: React.FC<AdditionalSaleDataSectionProps> = ({
  tipoNegocioId,
  tipoNegocioDescripcion,
  internetBafData,
  onInternetBafChange,
  portabilidadData,
  onPortabilidadChange,
  selectedClient,
  consultaBbooData,
  onConsultaBbooChange
}) => {
  
  const renderFormBasedOnType = () => {
    switch (tipoNegocioId) {
      case "2": // BAF (Cambiado a ID 2 como en tu ejemplo)
        return <InternetBafForm data={internetBafData} onChange={onInternetBafChange} />;
      case "1": // Portabilidad
        return <PortabilidadForm data={portabilidadData} onChange={onPortabilidadChange} selectedClient={selectedClient} />;
      case "3": // Consulta BBOO
        return <ConsultaBbooForm data={consultaBbooData} onChange={onConsultaBbooChange} />;
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
import React from 'react';
import Card from '../../common/Card.js';
import InternetBafForm from '../businessTypes/InternetBafForm.js';
import PortabilidadForm from '../businessTypes/portabilidad/PortabilidadFormPrincipal.js';
import ConsultaBbooForm from '../businessTypes/ConsultaBbooForm.js';
import { InternetBafState, PortabilidadState, Cliente, ConsultaBbooState } from '../../../types.js';

interface AdditionalSaleDataSectionProps {
  tipoNegocioId: string;
  tipoNegocioDescripcion: string;
  internetBafData: InternetBafState;
  onInternetBafChange: <K extends keyof InternetBafState>(field: K, value: InternetBafState[K]) => void;
  portabilidadData: PortabilidadState[];
  onPortabilidadChange: <K extends keyof PortabilidadState>(
    field: K,
    index: number,
    value: PortabilidadState[K]
  ) => void;
  selectedClient: Cliente | null;
  consultaBbooData: ConsultaBbooState;
  onConsultaBbooChange: <K extends keyof ConsultaBbooState>(field: K, value: ConsultaBbooState[K]) => void;
  onDeletePortabilidad: (index: number) => void;
  onAddPortabilidad: () => void;
  handleErrors: (field: string, message: string) => void;
}

const AdditionalSaleDataSection: React.FC<AdditionalSaleDataSectionProps> = ({
  tipoNegocioId,
  internetBafData,
  onInternetBafChange,
  portabilidadData,
  onPortabilidadChange,
  consultaBbooData,
  onConsultaBbooChange,
  onDeletePortabilidad,
  onAddPortabilidad,
  handleErrors
}) => {

  const renderFormBasedOnType = () => {
    switch (tipoNegocioId) {
      case "2": // BAF (Cambiado a ID 2 como en tu ejemplo)
        return <InternetBafForm data={internetBafData} onChange={onInternetBafChange} handleErrors={handleErrors}/>;
      case "1": // Portabilidad
        return <PortabilidadForm data={portabilidadData} onChange={onPortabilidadChange} onDeletePortabilidad={onDeletePortabilidad} onAddPortabilidad={onAddPortabilidad} handleErrors={handleErrors}/>;
      case "3": // Consulta BBOO
        return <ConsultaBbooForm data={consultaBbooData} onChange={onConsultaBbooChange} />;
      case "4": // Venta BAF + Porta
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-200 mb-4 border-b border-gray-700 pb-2">Datos BAF/Internet</h3>
              <InternetBafForm data={internetBafData} onChange={onInternetBafChange} handleErrors={handleErrors}/>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-200 mb-4 border-b border-gray-700 pb-2">Datos Portabilidad</h3>
              <PortabilidadForm data={portabilidadData} onChange={onPortabilidadChange} onDeletePortabilidad={onDeletePortabilidad} onAddPortabilidad={onAddPortabilidad} handleErrors={handleErrors} />
            </div>
          </div>
        )
      default:
        return <p className="text-gray-400">Seleccione un tipo de negocio para ver campos adicionales.</p>;
    }
  };

  return (
    <Card className="mb-6">
      {renderFormBasedOnType()}
    </Card>
  );
};

export default AdditionalSaleDataSection;
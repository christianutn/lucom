
import React, { useState, useCallback } from 'react';
import InitialSelectionSection from './sections/InitialSelectionSection';
import ClientDataSection from './sections/ClientDataSection';
import AdditionalSaleDataSection from './sections/AdditionalSaleDataSection';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import { useNotification } from '../../hooks/useNotification';
import { saveSale } from '../../services/api';
import { InitialSelectionState, ClientDataState, InternetBafState, PortabilidadState, Cliente } from '../../types';

const initialSelectionDefault: InitialSelectionState = {
  tipoNegocioId: '',
  origenDatoId: '',
};

const clientDataDefault: ClientDataState = {
  tipoDocumentoId: '',
  numeroDocumento: '',
  nombre: '',
  apellido: '',
  telefonosPrincipales: [{ numero: '' }],
  telefonoSecundario: '',
  email: '',
  domicilioSeleccionadoId: 'NUEVO', // Default to new address input
  nuevoDomicilio: {
    calle: '',
    altura: '',
    entreCalle1: '',
    entreCalle2: '',
    barrioId: '',
    nuevoBarrioNombre: '',
    piso: '', // Added missing property
    departamento: '', // Added missing property
  },
  horarioContacto: '',
  convergencia: '',
  serviciosConvergentesIds: [],
};

const internetBafDefault: InternetBafState = {
  tipoDomicilioId: '',
  abonoId: '',
  tvhd: '',
  cantidadDecos: '',
  tipoConvergenciaId: '',
  lineaConvergente: '',
};

const portabilidadDefault: PortabilidadState = {
  nimAPortar: '',
  gigasId: '',
  companiaActualId: '',
};


const SalesForm: React.FC = () => {
  const [initialSelection, setInitialSelection] = useState<InitialSelectionState>(initialSelectionDefault);
  const [clientData, setClientData] = useState<ClientDataState>(clientDataDefault);
  const [internetBafData, setInternetBafData] = useState<InternetBafState>(internetBafDefault);
  const [portabilidadData, setPortabilidadData] = useState<PortabilidadState>(portabilidadDefault);
  
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);
  const [tipoNegocioDescripcion, setTipoNegocioDescripcion] = useState<string>('');


  const [isSaving, setIsSaving] = useState(false);
  const { showNotification } = useNotification();

  const handleInitialSelectionChange = useCallback(<K extends keyof InitialSelectionState,>(field: K, value: InitialSelectionState[K]) => {
    setInitialSelection(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleClientDataChange = useCallback(<K extends keyof ClientDataState,>(field: K, value: ClientDataState[K]) => {
    setClientData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleInternetBafChange = useCallback(<K extends keyof InternetBafState,>(field: K, value: InternetBafState[K]) => {
    setInternetBafData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handlePortabilidadChange = useCallback(<K extends keyof PortabilidadState,>(field: K, value: PortabilidadState[K]) => {
    setPortabilidadData(prev => ({ ...prev, [field]: value }));
  }, []);
  
  const handleClientSelected = useCallback((client: Cliente | null) => {
    setSelectedClient(client);
    // If client is cleared, potentially reset parts of portabilidad form if NIM was auto-filled
    if (!client) {
        setPortabilidadData(prev => ({ ...prev, nimAPortar: ''}));
    }
  }, []);

  const resetForm = useCallback(() => {
    setInitialSelection(initialSelectionDefault);
    setClientData(clientDataDefault);
    setInternetBafData(internetBafDefault);
    setPortabilidadData(portabilidadDefault);
    setSelectedClient(null);
    setTipoNegocioDescripcion('');
    // TODO: Clear search filters in ClientDataSection if they are managed there internally
    // Or lift search filter state up to here if full reset needed.
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Basic validation example
    if (!initialSelection.tipoNegocioId || !initialSelection.origenDatoId) {
        showNotification("Por favor complete la Sección de Selección Inicial.", "error");
        setIsSaving(false);
        return;
    }
    if (!clientData.tipoDocumentoId || !clientData.numeroDocumento || !clientData.nombre || !clientData.apellido) {
        showNotification("Por favor complete los datos básicos del cliente (Tipo y Nro Doc, Nombre, Apellido).", "error");
        setIsSaving(false);
        return;
    }
    // Add more specific validations based on tipoNegocioId for required fields in subforms
    // e.g. if (initialSelection.tipoNegocioId === '1' && !internetBafData.abonoId) { ... }
    
    const formData = {
      initialSelection,
      clientData: {
        ...clientData,
        selectedClientId: selectedClient?.id // Corrected property access
      },
      ...(initialSelection.tipoNegocioId === "1" && { internetBafData }), // ID for Internet (BAF)
      ...(initialSelection.tipoNegocioId === "3" && { portabilidadData }), // ID for Portabilidad
    };

    try {
      await saveSale(formData);
      showNotification('Venta guardada exitosamente.', 'success');
      resetForm();
    } catch (error) {
      console.error("Error saving sale:", error);
      showNotification('Error al guardar la venta. Intente nuevamente.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-24"> {/* Added padding bottom for final button visibility */}
      {isSaving && <Spinner />}
      
      <InitialSelectionSection 
        data={initialSelection} 
        onChange={handleInitialSelectionChange}
        setTipoNegocioDescripcion={setTipoNegocioDescripcion}
      />
      
      <ClientDataSection 
        data={clientData} 
        onChange={handleClientDataChange}
        onClientSelected={handleClientSelected}
      />
      
      {initialSelection.tipoNegocioId && (
        <AdditionalSaleDataSection
          tipoNegocioId={initialSelection.tipoNegocioId}
          tipoNegocioDescripcion={tipoNegocioDescripcion}
          internetBafData={internetBafData}
          onInternetBafChange={handleInternetBafChange}
          portabilidadData={portabilidadData}
          onPortabilidadChange={handlePortabilidadChange}
          selectedClient={selectedClient}
        />
      )}
      
      <div className="mt-8">
        <Button type="submit" variant="success" fullWidth disabled={isSaving}>
          {isSaving ? 'Guardando...' : 'Guardar Venta'}
        </Button>
      </div>
    </form>
  );
};

export default SalesForm;

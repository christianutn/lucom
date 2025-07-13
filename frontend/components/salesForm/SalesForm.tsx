import React, { useState, useCallback } from 'react';
import InitialSelectionSection from './sections/InitialSelectionSection';
import ClientDataSection from './sections/ClientDataSection';
import AdditionalSaleDataSection from './sections/AdditionalSaleDataSection';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import { useNotification } from '../../hooks/useNotification';
import { InitialSelectionState, ClientDataState, InternetBafState, PortabilidadState, Cliente } from '../../types';
import { postVenta } from '../../services/api';

const initialSelectionDefault: InitialSelectionState = {
  tipoNegocioId: '',
  origenDatoId: '',
};

const clientDataDefault: ClientDataState = {
  tipoDocumentoId: '',
  numeroDocumento: '',
  nombre: '',
  apellido: '',
  telefonosPrincipales: [{ numero: '', id: '' }],
  telefonoSecundario: '',
  email: '',
  domicilioSeleccionadoId: '',
  clienteId: '',
  nuevoDomicilio: {
    calle: '', altura: '', entreCalle1: '', entreCalle2: '', barrioId: '', nuevoBarrioNombre: '', piso: '', departamento: '',
  },
  horarioContacto: '',
  convergencia: '',
  serviciosConvergentesIds: [],
};

const internetBafDefault: InternetBafState = {
  tipoDomicilioId: '', abonoId: '', tvhd: '', cantidadDecos: '', tipoConvergenciaId: '', lineaConvergente: '',
};

const portabilidadDefault: PortabilidadState = {
  nimAPortar: '', gigasId: '', companiaActualId: '',
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

  const handleInitialSelectionChange = useCallback(<K extends keyof InitialSelectionState>(field: K, value: InitialSelectionState[K]) => {
    setInitialSelection(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleClientDataChange = useCallback(<K extends keyof ClientDataState>(field: K, value: ClientDataState[K]) => {
    setClientData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleInternetBafChange = useCallback(<K extends keyof InternetBafState>(field: K, value: InternetBafState[K]) => {
    setInternetBafData(prev => {
      const newState = { ...prev, [field]: value };
      // Si el campo modificado es 'tvhd' y el nuevo valor es 'No',
      // reseteamos la cantidad de decos a '0'.
      if (field === 'tvhd' && value === 'No') {
        newState.cantidadDecos = '0';
      }
      return newState;
    });
  }, []);

  const handlePortabilidadChange = useCallback(<K extends keyof PortabilidadState>(field: K, value: PortabilidadState[K]) => {
    setPortabilidadData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleClientSelected = useCallback((client: Cliente | null) => {
    setSelectedClient(client);
    if (!client) {
      setPortabilidadData(prev => ({ ...prev, nimAPortar: '' }));
    }
  }, []);

  const resetForm = useCallback(() => {
    setInitialSelection(initialSelectionDefault);
    setClientData(clientDataDefault);
    setInternetBafData(internetBafDefault);
    setPortabilidadData(portabilidadDefault);
    setSelectedClient(null);
    setTipoNegocioDescripcion('');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // --- Validación básica (puedes añadir más) ---
    if (!initialSelection.tipoNegocioId || !initialSelection.origenDatoId || !clientData.tipoDocumentoId || !clientData.numeroDocumento || !clientData.nombre || !clientData.apellido) {
      showNotification("Por favor complete todos los campos obligatorios del cliente y la selección inicial.", "error");
      setIsSaving(false);
      return;
    }

    // --- CONSTRUCCIÓN DEL PAYLOAD DINÁMICO ---

    // 1. Construir el objeto de detalles basado en el tipo de negocio
    let detallesPayload = {};
    if (initialSelection.tipoNegocioId === '1') { // Portabilidad
      detallesPayload = {
        NIM_a_portar: portabilidadData.nimAPortar,
        gigas: portabilidadData.gigasId,
        compania: portabilidadData.companiaActualId,
      };
    } else if (initialSelection.tipoNegocioId === '2') { // BAF
      detallesPayload = {
        tipos_domicilios_id: internetBafData.tipoDomicilioId,
        abono_id: internetBafData.abonoId,
        TVHD: internetBafData.tvhd === 'Sí' ? 1 : 0,
        cantidad_decos: internetBafData.cantidadDecos,
        horario_contacto: clientData.horarioContacto, // Este campo es común pero el backend lo espera en detalles BAF
        tipo_convergencia_id: internetBafData.tipoConvergenciaId,
      };
    }

    // 2. Construir el objeto principal 'ventaConDetalle'
    const ventaConDetalle: any = {
      datosVenta: {
        comentario_horario_contacto: clientData.horarioContacto,
        convergencia: clientData.convergencia === 'Sí' ? 1 : 0,
        tipo_negocio_id: initialSelection.tipoNegocioId,
        cliente_id: clientData.clienteId || "", // Usa el ID del cliente seleccionado o "" si es nuevo
        domicilio_id: clientData.domicilioSeleccionadoId !== 'NUEVO' ? clientData.domicilioSeleccionadoId : "",
        origen_dato_id: initialSelection.origenDatoId,
      },
      detalles: detallesPayload,
      cliente: {
        id: clientData.clienteId || "", // "" si es nuevo
        tipo_documento: clientData.tipoDocumentoId,
        numero_documento: clientData.numeroDocumento,
        nombre: clientData.nombre,
        apellido: clientData.apellido,
        telefono_secundario: clientData.telefonoSecundario,
        correo_electronico: clientData.email,
      },
      telefonos_principales: clientData.telefonosPrincipales
        .filter(tel => tel.numero.trim() !== '') // Solo enviar teléfonos con número
        .map(tel => ({
          id: tel.id || "", // "" si es un campo nuevo
          cliente_id: clientData.clienteId || "",
          numero_telefono: tel.numero,
        })),
      domicilio: {

        id: clientData.domicilioSeleccionadoId !== 'NUEVO' ? clientData.domicilioSeleccionadoId : "",
        cliente_id: clientData.clienteId || "",
        nombre_calle: clientData.nuevoDomicilio.calle,
        numero_calle: clientData.nuevoDomicilio.altura,
        entre_calle_1: clientData.nuevoDomicilio.entreCalle1 || '',
        entre_calle_2: clientData.nuevoDomicilio.entreCalle2 || '',
        piso: clientData.nuevoDomicilio.piso || '',
        departamento: clientData.nuevoDomicilio.departamento || '',
        barrio_id: isNaN(Number(clientData.nuevoDomicilio.barrioId)) ? "" : clientData.nuevoDomicilio.barrioId
      },
      barrio: {
        id: isNaN(Number(clientData.nuevoDomicilio.barrioId)) ? "" : clientData.nuevoDomicilio.barrioId,
        nombre: clientData.nuevoDomicilio.nuevoBarrioNombre || ""
      }
    };

    

    // Ahora 'ventaConDetalle' tiene la estructura exacta que el backend espera

    try {
      await postVenta(ventaConDetalle);
      showNotification('Venta guardada exitosamente.', 'success');
      resetForm();
    } catch (error) {
      console.error("Error saving sale:", error);
      const errorMessage = (error as any).response?.data?.message || 'Error al guardar la venta. Intente nuevamente.';
      showNotification(errorMessage, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-24">
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
        <Button type="submit" variant="primary" fullWidth disabled={isSaving}>
          {isSaving ? 'Guardando...' : 'Guardar Venta'}
        </Button>
      </div>
    </form>
  );
};

export default SalesForm;
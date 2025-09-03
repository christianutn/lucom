import React, { useState, useCallback, useMemo } from 'react';
import { useNotification } from '../../hooks/useNotification';
import Button from "../common/Button";
import Spinner from '../common/Spinner';
import { Save } from 'lucide-react';
import ClientDataSection from "../salesForm/sections/ClientDataSection";
import ConsultaBbooForm from "../salesForm/businessTypes/ConsultaBbooForm";
import { postConsultaBboo } from "../../services/consultas-bboo";
import { ClientDataState, Cliente, ClientDataStateErrors, ConsultaBbooState, IConsultaBbooCreate } from '../../types';
import ClientDataSectionParaConsulta from './ClientDataFormParaConsulta';

// --- Estados Iniciales ---
const clientDataDefault: ClientDataState = {
  tipoDocumentoId: '',
  numeroDocumento: '',
  nombre: '',
  apellido: '',
  telefono_principal: '',
  telefonoSecundario: '',
  email: '',
  domicilioSeleccionadoId: '',
  clienteId: '',
  nuevoDomicilio: {
    calle: '', altura: '', entreCalle1: '', entreCalle2: '', barrioId: '', nuevoBarrioNombre: '', piso: '', departamento: '',
  },
  horarioContacto: '', // Mantenido por tipo, aunque no se use en BBOO
  serviciosConvergentesIds: [],
  fechaNacimiento: '',
};

const clientDataErrorsDefault: ClientDataStateErrors = {
  tipoDocumentoId: "",
  numeroDocumento: "",
  nombre: "",
  apellido: "",
  telefono_principal: "",
  telefonoSecundario: "",
  email: "",
  domicilioSeleccionadoId: "",
  clienteId: "",
  nuevoDomicilio: {
    calle: "",
    altura: "",
    entreCalle1: "",
    entreCalle2: "",
    barrioId: "",
    nuevoBarrioNombre: "",
    piso: "",
    departamento: "",
  },
  serviciosConvergentesIds: "",
  fechaNacimiento: "",
};

const consultaBbooStateDefault: ConsultaBbooState = {
  tipoDomicilioId: '',
  lineaClaroAConsultar: '',
  pedidoRellamado: '',
};

// --- Componente Principal ---
const ConsultForm = () => {
  const [clientData, setClientData] = useState<ClientDataState>(clientDataDefault);
  const [consultaBbooData, setConsultaBbooData] = useState<ConsultaBbooState>(consultaBbooStateDefault);
  const [isSaving, setIsSaving] = useState(false);
  const { showNotification } = useNotification();
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);

  const [clientDataErrors, setClientDataErrors] = useState<ClientDataStateErrors>(clientDataErrorsDefault);

  const isClientDataEntered = useMemo(() => {
    return clientData.nombre.trim() !== '' ||
      clientData.apellido.trim() !== '' ||
      clientData.email.trim() !== '' ||
      clientData.telefono_principal.trim() !== '';
  }, [clientData]);

  const validateForm = useCallback(() => {
    if (!consultaBbooData.tipoDomicilioId) {
      showNotification('Debe seleccionar un tipo de domicilio.', 'error');
      return false;
    }
    if (isClientDataEntered) {
      if (!clientData.nombre.trim() || !clientData.apellido.trim() || !clientData.email.trim() || !clientData.telefono_principal.trim()) {
        showNotification('Si ingresa datos de cliente, los campos Nombre, Apellido, Email y Teléfono Principal son obligatorios.', 'error');
        return false;
      }
    }
    return true;
  }, [consultaBbooData, clientData, isClientDataEntered, showNotification]);

  const handleClientDataChange = useCallback(<K extends keyof ClientDataState>(field: K, value: ClientDataState[K]) => {
    setClientData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleConsultaBbooChange = useCallback(<K extends keyof ConsultaBbooState>(field: K, value: ConsultaBbooState[K]) => {
    setConsultaBbooData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleClientSelected = useCallback((client: Cliente | null) => {
    setSelectedClient(client);
  }, []);

  const handleClientDataErrors = useCallback((errors: ClientDataStateErrors) => {
    setClientDataErrors(errors);
  }, []);

  const resetForm = useCallback(() => {
    setClientData(clientDataDefault);
    setConsultaBbooData(consultaBbooStateDefault);
    setClientDataErrors(clientDataErrorsDefault);
    setSelectedClient(null);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    //if (!validateForm()) return;

    setIsSaving(true);

    // --- CONSTRUCCIÓN DEL PAYLOAD ---
    // El backend SIEMPRE espera la estructura completa.
    const consultaBboo: IConsultaBbooCreate = {
      detalles: {
        tipos_domicilios_id: consultaBbooData.tipoDomicilioId || "",
        linea_claro_a_consultar: consultaBbooData.lineaClaroAConsultar,
        pedido_rellamado: consultaBbooData.pedidoRellamado,
        cliente_id: clientData.clienteId || "",
        domicilio_id: clientData.domicilioSeleccionadoId !== 'NUEVO' ? clientData.domicilioSeleccionadoId : "",
      },
      cliente: {
        id: clientData.clienteId || "",
        tipo_documento: clientData.tipoDocumentoId || "",
        numero_documento: clientData.numeroDocumento,
        nombre: clientData.nombre,
        apellido: clientData.apellido,
        telefono_secundario: clientData.telefonoSecundario,
        correo_electronico: clientData.email,
        telefono_principal: clientData.telefono_principal,
        fecha_nacimiento: clientData.fechaNacimiento || "",
      },
      domicilio: {
        id: clientData.domicilioSeleccionadoId !== 'NUEVO' ? clientData.domicilioSeleccionadoId : "",
        cliente_id: clientData.clienteId || "",
        nombre_calle: clientData.nuevoDomicilio.calle,
        numero_calle: clientData.nuevoDomicilio.altura,
        entre_calle_1: clientData.nuevoDomicilio.entreCalle1,
        entre_calle_2: clientData.nuevoDomicilio.entreCalle2,
        piso: clientData.nuevoDomicilio.piso,
        departamento: clientData.nuevoDomicilio.departamento,
        barrio_id: clientData.nuevoDomicilio.barrioId !== 'NUEVO_BARRIO' ? clientData.nuevoDomicilio.barrioId : "",
      },
      barrio: {
        // Si el barrio es nuevo, se envía el nombre. Si se seleccionó uno existente, el backend usará el barrio_id del domicilio.
        id: clientData.nuevoDomicilio.barrioId !== 'NUEVO_BARRIO' ? clientData.nuevoDomicilio.barrioId : "",
        nombre: clientData.nuevoDomicilio.barrioId === 'NUEVO_BARRIO' ? clientData.nuevoDomicilio.nuevoBarrioNombre : "",
      }
    };

    try {
      await postConsultaBboo(consultaBboo);
      showNotification('Consulta guardada exitosamente.', 'success');
      resetForm();
    } catch (error) {
      const errorMessage = (error as any).response?.data?.message || 'Error al guardar la consulta.';
      showNotification(errorMessage, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-4 sm:p-6 bg-gray-800 rounded-lg shadow-lg">
      {isSaving && <Spinner />}

      <ConsultaBbooForm
        data={consultaBbooData}
        onChange={handleConsultaBbooChange}
      />

      <ClientDataSectionParaConsulta
        data={clientData}
        errors={clientDataErrors}
        onChange={handleClientDataChange}
        onClientSelected={handleClientSelected}
        onClientDataErrors={handleClientDataErrors}
      />

      <div className="mt-10 flex justify-end">
        <Button type="submit" variant="primary" fullWidth={false} disabled={isSaving} className="flex items-center gap-2">
          {isSaving ? (
            <>
              <Spinner />
              <span>Guardando...</span>
            </>
          ) : (
            <>
              <Save size={20} />
              <span>Guardar Consulta</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default ConsultForm;
import React, { useState, useCallback } from 'react';
import InitialSelectionSection from './sections/InitialSelectionSection';
import ClientDataSection from './sections/ClientDataSection';
import AdditionalSaleDataSection from './sections/AdditionalSaleDataSection';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import { useNotification } from '../../hooks/useNotification';
import { InitialSelectionState, ClientDataState, InternetBafState, PortabilidadState, Cliente, ClientDataStateErrors, ConsultaBbooState } from '../../types';
import { postVenta } from '../../services/api';
import { Save } from 'lucide-react';
import { validarTelefono } from '@/utils/validarDatosEntrada';

const initialSelectionDefault: InitialSelectionState = {
  tipoNegocioId: '',
  origenDatoId: '',
};



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
  horarioContacto: '',
  serviciosConvergentesIds: [],
  fechaNacimiento: '',
};

const clientDataErrorsDefault: ClientDataStateErrors = {
  tipoDocumentoId: '',
  numeroDocumento: 'El número de documento es requerido',
  nombre: 'El nombre es requerido',
  apellido: 'El apellido es requerido',
  telefono_principal: 'El teléfono principal es requerido y debe tener 10 dígitos.',
  telefonoSecundario: '',
  email: 'El correo electrónico del cliente es requerido',
  domicilioSeleccionadoId: '',
  clienteId: '',
  nuevoDomicilio: {
    calle: 'La calle es requerida', altura: 'La altura es requerida', entreCalle1: '', entreCalle2: '', barrioId: '', nuevoBarrioNombre: '', piso: '', departamento: '',
  },
  serviciosConvergentesIds: '',
  fechaNacimiento: '',
};


const internetBafDefault: InternetBafState = {
  tipoDomicilioId: '', abonoId: '', tvhd: "No", cantidadDecos: 0, tipoConvergenciaId: '', lineaConvergente: '', horario_contacto: ""
};

const portabilidadDefault: PortabilidadState[] = [
  {
    nimAPortar: "",
    gigasId: "",
    companiaId: ""
  }
]


const consultaBbooStateDefault: ConsultaBbooState = {
  tipoDomicilioId: '',
  lineaClaroAConsultar: '',
  pedidoRellamado: '',
}



const SalesForm: React.FC = () => {
  const [initialSelection, setInitialSelection] = useState<InitialSelectionState>(initialSelectionDefault);
  const [clientData, setClientData] = useState<ClientDataState>(clientDataDefault);
  const [internetBafData, setInternetBafData] = useState<InternetBafState>(internetBafDefault);
  const [portabilidadData, setPortabilidadData] = useState<PortabilidadState[]>(portabilidadDefault);
  const [consultaBbooData, setConsultaBbooData] = useState<ConsultaBbooState>(consultaBbooStateDefault);
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);
  const [tipoNegocioDescripcion, setTipoNegocioDescripcion] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const { showNotification } = useNotification();

  // Errores
  const [clientDataErrors, setClientDataErrors] = useState<ClientDataStateErrors>(clientDataErrorsDefault);

  const obtenerErrores = (errores: ClientDataStateErrors): string[] => {
  const mensajesDeError: string[] = [];

  const clavesNoObligatorias = [
    'tipoDocumentoId',
    'telefonoSecundario',
    'email',
    'domicilioSeleccionadoId',
    'telefonoSecundario',
    'email',
    'clienteId',
    'entreCalle1',
    'entreCalle2',
    'barrioId',
    'piso',
    'departamento',
    'convergencia',
    'serviciosConvergentesIds',
  ];
  // Iterar sobre las propiedades de nivel superior del objeto de errores
  for (const key in errores) {
    // Asegurarse de que la propiedad sea realmente del objeto y no heredada
    if (Object.prototype.hasOwnProperty.call(errores, key)) {
      const value = errores[key as keyof ClientDataStateErrors]; // Casteo para TypeScript

      // Verificar si el valor es una cadena y si NO está vacía
      if (typeof value === 'string' && value !== '' && !clavesNoObligatorias.includes(key)) {
        mensajesDeError.push(value);
      }
    }
  }

  // Manejar las propiedades anidadas explícitamente (en este caso, 'nuevoDomicilio')
  // Si tuvieras más objetos anidados, necesitarías una función recursiva o iteraciones adicionales.
  if (errores.nuevoDomicilio) {
    for (const nestedKey in errores.nuevoDomicilio) {
      if (Object.prototype.hasOwnProperty.call(errores.nuevoDomicilio, nestedKey)) {
        const nestedValue = errores.nuevoDomicilio[nestedKey as keyof typeof errores.nuevoDomicilio];

        if (typeof nestedValue === 'string' && nestedValue !== '' && !clavesNoObligatorias.includes(nestedKey)) {
          mensajesDeError.push(nestedValue);
        }
      }
    }
  }

  // Validar campos de telefonos en portabilidad

  for (let i = 0; i < portabilidadData.length; i++) {
    if(!validarTelefono(portabilidadData[i].nimAPortar)){
      mensajesDeError.push(`El número a portar ${portabilidadData[i].nimAPortar} no es válido.`);
    }
  }

  // Validar que esté cargada las direcciones

  if(!clientData.nuevoDomicilio.calle || !clientData.nuevoDomicilio.altura ){
    mensajesDeError.push("Debes ingresar una dirección válida. Al menos calle y altura");
  } 



  return mensajesDeError;
}
  // Maneja errores reportados por el hijo

  const [errors, setErrors] = useState<{ [field: string]: string }>({});

  const handleErrors = (field: string, message: string) => {
    setErrors((prev) => ({
      ...prev,
      [field]: message,
    }));
  };


  const handleInitialSelectionChange = useCallback(<K extends keyof InitialSelectionState>(field: K, value: InitialSelectionState[K]) => {
    setInitialSelection(prev => ({ ...prev, [field]: value }));

    // Reiniciar los errores
    if(field == "tipoNegocioId"){
      setErrors({})
    }
  }, []);

  const handleClientDataChange = useCallback(<K extends keyof ClientDataState>(field: K, value: ClientDataState[K]) => {
    setClientData(prev => ({ ...prev, [field]: value }));

  }, []);

  const handleInternetBafChange = useCallback(<K extends keyof InternetBafState>(field: K, value: InternetBafState[K]) => {
    setInternetBafData(prev => {
      const newState = { ...prev, [field]: value };
      // Si el campo modificado es 'tvhd' y el nuevo valor es 'No',
      // reseteamos la cantidad de decos a '0'.
      if (field === 'tvhd' && (value === 'No' || value === '')) {
        newState.cantidadDecos = 0;
      }
      return newState;
    });
  }, []);

  const handlePortabilidadChange = useCallback(<K extends keyof PortabilidadState>(
    field: K,
    index: number,
    value: PortabilidadState[K]
  ) => {
    setPortabilidadData(prev => {
      const newData = [...prev];
      newData[index] = { ...newData[index], [field]: value };
      return newData;
    });
  }, []);

  const handleDeletePortabilidad = useCallback((index: number) => {
    setPortabilidadData(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleAddPortabilidad = useCallback(() => {
    setPortabilidadData(prev => [...prev, { nimAPortar: "", gigasId: "", companiaId: "" }]);
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
    setInitialSelection(initialSelectionDefault);
    setClientData(clientDataDefault);
    setInternetBafData(internetBafDefault);
    setPortabilidadData(portabilidadDefault);
    setSelectedClient(null);
    setTipoNegocioDescripcion('');
    setErrors({});
  }, []);

  const restErrors = useCallback(() => {
    setClientDataErrors({
      tipoDocumentoId: '',
      numeroDocumento: 'El número de documento es requerido',
      nombre: 'El nombre es requerido',
      apellido: 'El apellido es requerido',
      telefono_principal: 'El telefono principal es requerido',
      telefonoSecundario: '',
      email: 'El correo eléctronico del cliente es requerido',
      domicilioSeleccionadoId: '',
      clienteId: '',
      nuevoDomicilio: {
        calle: 'La calle es requerida', altura: 'La altura es requerida', entreCalle1: '', entreCalle2: '', barrioId: '', nuevoBarrioNombre: '', piso: '', departamento: '',
      },
      serviciosConvergentesIds: '',
      fechaNacimiento: '',
    });
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
      detallesPayload = portabilidadData;
    } else if (initialSelection.tipoNegocioId === '2') { // BAF
      detallesPayload = {
        tipos_domicilios_id: internetBafData.tipoDomicilioId,
        abono_id: internetBafData.abonoId,
        TVHD: internetBafData.tvhd === 'Sí' ? 1 : 0,
        cantidad_decos: internetBafData.cantidadDecos,
        horario_contacto: internetBafData.horario_contacto, // Este campo es común pero el backend lo espera en detalles BAF
        tipo_convergencia_id: internetBafData.tipoConvergenciaId,
      };
    } else if (initialSelection.tipoNegocioId === '3') { // Consulta BBOO
      detallesPayload = {
        tipos_domicilios_id: consultaBbooData.tipoDomicilioId,
        linea_claro_a_consultar: consultaBbooData.lineaClaroAConsultar,
        pedido_rellamado: consultaBbooData.pedidoRellamado,
      }
    } else if (initialSelection.tipoNegocioId === '4') { // Venta BAF + Porta
      detallesPayload = {
        tipos_domicilios_id: internetBafData.tipoDomicilioId,
        abono_id: internetBafData.abonoId,
        TVHD: internetBafData.tvhd === 'Sí' ? 1 : 0,
        cantidad_decos: internetBafData.cantidadDecos,
        horario_contacto: internetBafData.horario_contacto, // Este campo es común pero el backend lo espera en detalles BAF
        tipo_convergencia_id: internetBafData.tipoConvergenciaId,
        portabilidades: portabilidadData,
      }
    }


    // 2. Construir el objeto principal 'ventaConDetalle'
    const ventaConDetalle: any = {
      datosVenta: {
        comentario_horario_contacto: clientData.horarioContacto,
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
        fecha_nacimiento: clientData.fechaNacimiento,
        telefono_principal: clientData.telefono_principal,
      },
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

      // Si los campos obligatorios son vacios, mostrar un aviso
      // Recorrer un objeto por clave
      if (obtenerErrores(clientDataErrors).length > 0) {
        const errorMessages = obtenerErrores(clientDataErrors).join(' - ');
        showNotification(`Faltan completar los siguientes campos: ${errorMessages}`, 'error');
        return;
      }

      if (Object.values(errors).some(msg => msg !== '')) {
        showNotification(
          `Campos inválidos: ${Object.values(errors).filter(Boolean).join(' - ')}`,
          'error'
        );
        return;
      }


      await postVenta(ventaConDetalle);
      showNotification('Venta guardada exitosamente.', 'success');
      resetForm();
      restErrors();
      setErrors({});
    } catch (error) {
      const errorMessage = 'Error al guardar la venta. Revise los datos del formulario.';
      showNotification(errorMessage, 'error');
    } finally {
      setIsSaving(false);
    }
  };



  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-4 sm:p-6 bg-gray-800 rounded-lg shadow-lg">
      {isSaving && <Spinner />}

      <InitialSelectionSection
        data={initialSelection}
        onChange={handleInitialSelectionChange}
        setTipoNegocioDescripcion={setTipoNegocioDescripcion}
      />

      {
        initialSelection.tipoNegocioId && initialSelection.origenDatoId && (
          <ClientDataSection
            data={clientData}
            onChange={handleClientDataChange}
            onClientSelected={handleClientSelected}
            onClientDataErrors={handleClientDataErrors}
            errors={clientDataErrors}
          />
        )
      }

      {initialSelection.tipoNegocioId && initialSelection.origenDatoId && (
        <AdditionalSaleDataSection
          tipoNegocioId={initialSelection.tipoNegocioId}
          tipoNegocioDescripcion={tipoNegocioDescripcion}
          internetBafData={internetBafData}
          onInternetBafChange={handleInternetBafChange}
          portabilidadData={portabilidadData}
          onPortabilidadChange={handlePortabilidadChange}
          selectedClient={selectedClient}
          consultaBbooData={consultaBbooData}
          onConsultaBbooChange={handleConsultaBbooChange}
          onDeletePortabilidad={handleDeletePortabilidad}
          onAddPortabilidad={handleAddPortabilidad}
          handleErrors={handleErrors}

        />
      )}

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
              <span>Guardar Venta</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default SalesForm;

import React, { useState, useEffect, useCallback } from 'react';
import Card from '../../common/Card';
import Input from '../../common/Input';
import Select from '../../common/Select';
import Button from '../../common/Button';
import Spinner from '../../common/Spinner';
import DomicilioSelectionModal from '../common/DomicilioSelectionModal';
import { getTiposDocumento, getClientes, getServiciosConvergentes, getBarrios } from '../../../services/api';
import { TipoDocumento as TipoDocOption, Cliente, ClientDataState, ClientSearchFilters, Domicilio, Barrio, SelectOption, ClientDataStateErrors } from '../../../types';
import { useNotification } from '../../../hooks/useNotification';
import { formatName, formatearNombreCalle } from "../../../utils/formatear";
import { validarNombreApellido, validarCuit, validarTelefono, validarEmail } from '../../../utils/validarDatosEntrada';


interface ClientDataSectionProps {
  data: ClientDataState;
  errors: ClientDataStateErrors;
  onChange: <K extends keyof ClientDataState>(field: K, value: ClientDataState[K]) => void;
  onClientSelected: (client: Cliente | null) => void;
  onClientDataErrors: (errors: ClientDataStateErrors) => void;
}


const ClientDataSection: React.FC<ClientDataSectionProps> = ({ data, onChange, onClientSelected, errors, onClientDataErrors }) => {
  const [tiposDocumento, setTiposDocumento] = useState<TipoDocOption[]>([]);
  const [serviciosConvergentes, setServiciosConvergentes] = useState<SelectOption[]>([]);
  const [barriosOptions, setBarriosOptions] = useState<SelectOption[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isDomicilioModalOpen, setIsDomicilioModalOpen] = useState(false);

  const [searchFilters, setSearchFilters] = useState<ClientSearchFilters>({ tipo_documento: '', numero_documento: '', apellido: '', nombre: '' });
  const [searchResults, setSearchResults] = useState<Cliente[]>([]);
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);
  const { showNotification } = useNotification();

  const [showAddressForm, setShowAddressForm] = useState(false);

  // Lista de opciones para el select de barrios, incluyendo la opción de crear uno nuevo.
  const allBarriosOptions: SelectOption[] = [
    ...barriosOptions,
    { id: 'NUEVO_BARRIO', descripcion: '+ Crear nuevo barrio...', activo: 1 }
  ];

  const fetchInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [tdRes, scRes, bRes] = await Promise.all([getTiposDocumento(), getServiciosConvergentes(), getBarrios()]);
      setTiposDocumento(tdRes);
      setServiciosConvergentes(scRes);
      setBarriosOptions(bRes.map((b: Barrio) => ({ id: b.id.toString(), descripcion: b.nombre, activo: b.activo })));
    } catch (error) {
      console.error("Error fetching client section data:", error);
      showNotification("Error al cargar datos iniciales para cliente.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  useEffect(() => { fetchInitialData(); }, [fetchInitialData]);

  const handleSearchChange = <K extends keyof ClientSearchFilters>(field: K, value: ClientSearchFilters[K]) => {
    setSearchFilters(prev => ({ ...prev, [field]: value }));
  };

  const resetAddressFields = useCallback(() => {
    onChange('nuevoDomicilio', { calle: '', altura: '', entreCalle1: '', entreCalle2: '', barrioId: '', nuevoBarrioNombre: '', piso: '', departamento: '' });
  }, [onChange]);

  const handleSearchClient = async () => {
    setIsSearching(true);
    setSearchResults([]);
    setSelectedClient(null);
    onClientSelected(null);
    onChange('domicilioSeleccionadoId', '');
    resetAddressFields();
    setShowAddressForm(false);

    try {
      const results = await getClientes(searchFilters);
      setSearchResults(results);
      if (results.length === 0) {
        showNotification("No se encontraron clientes con los criterios de búsqueda.", "info");
      }
    } catch (error) {
      console.error("Error searching clients:", error);
      showNotification("Error al buscar clientes.", "error");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectClient = (client: Cliente) => {
    setSelectedClient(client);
    setSearchResults([]);
    onClientSelected(client);
    onChange('tipoDocumentoId', client.tipo_documento.toString());
    onChange('numeroDocumento', client.numero_documento);
    errors.numeroDocumento = '';
    onChange('nombre', client.nombre);
    errors.nombre = '';
    onChange('apellido', client.apellido);
    errors.apellido = '';
    onChange('email', client.correo_electronico || '');
    errors.email = client.correo_electronico ? '' : 'El cliente debe tener un correo electrónico.';
    onChange('clienteId', client.id.toString());
    onChange('telefono_principal', client.telefono_principal || '');
    errors.telefono_principal = client.telefono_principal ? '' : 'El cliente debe tener un teléfono principal.';
    onChange('telefonoSecundario', client.telefono_secundario || '');
    onChange('domicilioSeleccionadoId', '');
    onChange('fechaNacimiento', client.fecha_nacimiento || '');
    resetAddressFields();
    setShowAddressForm(false);
  };

  const handleDomicilioButtonClick = () => {
    if (selectedClient && selectedClient.domicilios?.length > 0) {
      setIsDomicilioModalOpen(true);
    } else {
      onChange('domicilioSeleccionadoId', 'NUEVO');
      resetAddressFields();
      setShowAddressForm(true);
    }
  };

  const handleModalSelectExisting = (domicilio: Domicilio) => {
    onChange('domicilioSeleccionadoId', domicilio.id.toString());
    onChange('nuevoDomicilio', {
      calle: domicilio.nombre_calle,
      altura: domicilio.numero_calle,
      entreCalle1: domicilio.entre_calle_1 || '',
      entreCalle2: domicilio.entre_calle_2 || '',
      barrioId: domicilio.barrio_id ? domicilio.barrio_id.toString() : '',
      nuevoBarrioNombre: domicilio.barrio?.nombre || '',
      piso: domicilio.piso?.toString() || '',
      departamento: domicilio.departamento || '',
    });
    errors.nuevoDomicilio.calle = '';
    errors.nuevoDomicilio.altura = '';
    errors.nuevoDomicilio.nuevoBarrioNombre = '';
  
    setIsDomicilioModalOpen(false);
    setShowAddressForm(true);
  };

  const handleModalSelectNew = () => {
    onChange('domicilioSeleccionadoId', 'NUEVO');
    resetAddressFields();
    setIsDomicilioModalOpen(false);
    setShowAddressForm(true);
  };

  const handleBarrioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    onChange('nuevoDomicilio', {
      ...data.nuevoDomicilio,
      barrioId: selectedId !== 'NUEVO_BARRIO' ? selectedId : 'NUEVO_BARRIO',
      nuevoBarrioNombre: barriosOptions.find(b => b.id === selectedId)?.descripcion || ''
    });

    if (barriosOptions.find(b => b.id === selectedId)?.descripcion != '') {
      errors.nuevoDomicilio.nuevoBarrioNombre = '';
    } else {
      errors.nuevoDomicilio.nuevoBarrioNombre = 'Debes ingresar un nombre para el nuevo barrio.';
    }
  };

  const handleNuevoBarrioKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Previene que el formulario se envíe por error
      const nuevoNombre = data.nuevoDomicilio.nuevoBarrioNombre.trim();


      if (nuevoNombre === '') {
        showNotification("Ingrese un nombre para el nuevo barrio.", "info");
        return;
      }

      // Creamos una opción temporal para el nuevo barrio
      // Usamos el propio nombre como ID temporal, ya que es único en este contexto.
      // El backend lo identificará como nuevo porque no es un número.
      const tempId = nuevoNombre;
      const nuevaOpcion: SelectOption = { id: tempId, descripcion: nuevoNombre, activo: 1 };

      // Añadimos la opción a la lista para que aparezca en el select
      setBarriosOptions(prev => [...prev, nuevaOpcion]);

      // Actualizamos el estado del formulario para seleccionar el nuevo barrio
      // y mantener los datos del domicilio que ya estaban cargados.
      onChange('nuevoDomicilio', {
        ...data.nuevoDomicilio,
        barrioId: tempId,
        // 'nuevoBarrioNombre' ya tiene el valor correcto
      });
    }
  };



  const activeClientDomicilios = selectedClient?.domicilios.filter(d => d.activo === 1) || [];

  if (isLoading) {
    return (
      <Card>
        <div className="relative h-40">
          <Spinner />
        </div>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      {isSearching && <Spinner />}

      {/* SECCIÓN DE BÚSQUEDA DE CLIENTE */}
      <div className="mb-6 p-4 border border-gray-700 rounded-lg bg-gray-800">
        <h3 className="text-lg font-semibold mb-3 text-gray-200">Buscar Cliente Existente</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <Select label="Tipo Doc." id="searchTipoDoc" options={tiposDocumento.map(td => ({ id: td.id.toString(), descripcion: td.descripcion, activo: td.activo }))} value={searchFilters.tipo_documento} onChange={(e) => handleSearchChange('tipo_documento', e.target.value)} emptyOptionLabel="Todos" />
          <Input label="Nro. Doc." id="searchNroDoc" value={searchFilters.numero_documento} onChange={(e) =>
            handleSearchChange('numero_documento', e.target.value)

          } />
          <Input label="Apellido" id="searchApellido" value={searchFilters.apellido} onChange={(e) => handleSearchChange('apellido', e.target.value)} />
          <Input label="Nombre" id="searchNombre" value={searchFilters.nombre} onChange={(e) => handleSearchChange('nombre', e.target.value)} />

        </div>
        <Button onClick={handleSearchClient} variant="secondary" disabled={isSearching}>
          {isSearching ? 'Buscando...' : 'Buscar Cliente'}
        </Button>
      </div>

      {searchResults.length > 0 && (
        <div className="mb-6 p-4 border border-gray-700 rounded-lg bg-gray-800">
          <h4 className="text-md font-semibold mb-2 text-gray-200">Resultados de Búsqueda:</h4>
          <ul className="max-h-60 overflow-y-auto">
            {searchResults.map(client => (
              <li key={client.id} className="p-2 hover:bg-gray-700 cursor-pointer rounded" onClick={() => handleSelectClient(client)}>
                {client.apellido}, {client.nombre} ({client.tipoDocumento?.descripcion}: {client.numero_documento})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* SECCIÓN DE DATOS DEL CLIENTE */}
      <h3 className="text-lg font-semibold mb-4 mt-6 text-gray-200">{selectedClient ? `Editando Cliente: ${selectedClient.nombre} ${selectedClient.apellido}` : 'Ingresar Nuevo Cliente'}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select label="Tipo de Documento" id="tipoDocumento" options={tiposDocumento.map(td => ({ id: td.id.toString(), descripcion: td.descripcion, activo: td.activo }))} value={data.tipoDocumentoId}
          onChange={e => {
            onChange('tipoDocumentoId', e.target.value);

            if (e.target.value == "9" && !validarCuit(data.numeroDocumento)) {
              onClientDataErrors({ ...errors, numeroDocumento: 'El CUIT es invalido. Estos deben ser ingresado sin guiones.' });
            } else if ((e.target.value != "9" && data.numeroDocumento.length !== 8 && data.numeroDocumento.length !== 7) || !/^\d+$/.test(data.numeroDocumento)) {
              console.log(data.numeroDocumento);
              onClientDataErrors({ ...errors, numeroDocumento: 'El número de documento debe tener entre 7 y 8 dígitos numéricos.' });
            } else {
              onClientDataErrors({ ...errors, numeroDocumento: '' });
            }


          }} required emptyOptionLabel="Seleccione tipo" />
        <Input label="Número de Documento" id="numeroDocumento" value={data.numeroDocumento}
          onChange={e => {

            // Asegurarse de que solo se ingresen dígitos numéricos
            const sanitizedValue = e.target.value.replace(/[^0-9]/g, '');
            onChange('numeroDocumento', sanitizedValue);

            if (data.tipoDocumentoId == "9") {
              if (validarCuit(e.target.value)) {
                onClientDataErrors({ ...errors, numeroDocumento: '' });
              } else {
                onClientDataErrors({ ...errors, numeroDocumento: 'Debes ingresar un CUIT válido. Estos deben ser ingresados sin guiones.' });
              }
            } else if (data.tipoDocumentoId != "9") {
              if (e.target.value.length !== 8 && e.target.value.length !== 7 || !/^\d+$/.test(e.target.value)) {
                onClientDataErrors({ ...errors, numeroDocumento: 'El número de documento debe tener entre 7 y 8 dígitos numéricos.' });
              } else {
                onClientDataErrors({ ...errors, numeroDocumento: '' });
              }
            }

          }}
          error={errors.numeroDocumento}
          required />
        <Input label="Nombre" id="nombre" value={data.nombre}
          onChange={e => {
            const formattedName = formatName(e.target.value);
            onChange('nombre', formattedName);

            if (validarNombreApellido(formattedName)) {
              onClientDataErrors({ ...errors, nombre: '' });
            } else {
              onClientDataErrors({ ...errors, nombre: 'Debes ingresar un nombre válido.' });
            }

          }}
          error={errors.nombre}
          required />
        <Input label="Apellido" id="apellido" value={data.apellido}
          onChange={e => {
            const formattedApellido = formatName(e.target.value);
            onChange('apellido', formattedApellido);
            if (validarNombreApellido(formattedApellido)) {
              onClientDataErrors({ ...errors, apellido: '' });
            } else {
              onClientDataErrors({ ...errors, apellido: 'Debes ingresar un apellido válido.' });
            }
          }}
          error={errors.apellido}
          required />

        <Input
          label="Fecha de nacimiento"
          type="date"
          id="fechaNacimiento"
          value={data.fechaNacimiento || ''}
          onChange={e => {
            onChange('fechaNacimiento', e.target.value);
            // Si el año es anterior a hoy marcar error
            const selectedDate = new Date(e.target.value);
            const currentYear = new Date().getFullYear();
            if (selectedDate.getFullYear() > currentYear) {
              onClientDataErrors({ ...errors, fechaNacimiento: 'La fecha de nacimiento no puede ser en el futuro.' });
            } else {
              onClientDataErrors({ ...errors, fechaNacimiento: '' });
            }
          }}
          error={errors.fechaNacimiento}

        />

        <Input label="Teléfono de contacto principal" id="telPrincipal" type="tel" value={data.telefono_principal}
          onChange={e => {
            onChange('telefono_principal', e.target.value)
            if (validarTelefono(e.target.value)) {
              onClientDataErrors({ ...errors, telefono_principal: '' });
            } else {
              onClientDataErrors({ ...errors, telefono_principal: 'Debes ingresar un teléfono válido. Debe tener 10 dígitos.' });
            }
          }}
          placeholder="Número principal" className="flex-grow" error={errors.telefono_principal} required />

      

        <Input label="Teléfono de contacto secundario (opcional)" id="telefonoSecundario" type="tel" value={data.telefonoSecundario}
          onChange={e => {
            onChange('telefonoSecundario', e.target.value);

            if (validarTelefono(e.target.value) || e.target.value === '') {
              onClientDataErrors({ ...errors, telefonoSecundario: '' });
            } else {
              onClientDataErrors({ ...errors, telefonoSecundario: 'Debes ingresar un teléfono válido. Debe tener 10 dígitos.' });
            }

          }}
          error={errors.telefonoSecundario}
        />
        <Input label="Correo electrónico" id="email" type="email" value={data.email}
          onChange={e => {
            onChange('email', e.target.value);

            if (validarEmail(e.target.value)) {
              onClientDataErrors({ ...errors, email: '' });
            } else {
              onClientDataErrors({ ...errors, email: 'Debes ingresar un correo electrónica válido.' });
            }
          }}


          error={errors.email} />
      </div>

      {/* SECCIÓN DE DOMICILIO CORREGIDA */}
      <div className="mt-6 pt-6 border-t border-gray-700">
        <h4 className="text-md font-semibold mb-3 text-gray-200">Domicilio del Cliente</h4>
        <Button type="button" variant="secondary" className="mb-4 text-sm py-2" onClick={handleDomicilioButtonClick}>
          {selectedClient?.domicilios && selectedClient.domicilios.length > 0 ? 'Seleccionar o Cargar Domicilio' : 'Cargar Domicilio'}
        </Button>

        {showAddressForm && (
          <div className="space-y-4 p-4 border border-gray-700 rounded-lg bg-gray-800 mt-2">
            <h5 className="text-sm font-semibold text-gray-300">
              {data.domicilioSeleccionadoId === 'NUEVO' ? 'Datos del Nuevo Domicilio' : 'Editando Domicilio Seleccionado'}
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Calle" id="calle" value={data.nuevoDomicilio.calle}
                onChange={e => {
                  const formattedCalle = formatearNombreCalle(e.target.value);
                  onChange('nuevoDomicilio', { ...data.nuevoDomicilio, calle: formattedCalle })
                  if (e.target.value === '') {
                    onClientDataErrors({ ...errors, nuevoDomicilio: { ...errors.nuevoDomicilio, calle: 'Debes ingresar una calle.' } });
                  } else {
                    onClientDataErrors({ ...errors, nuevoDomicilio: { ...errors.nuevoDomicilio, calle: '' } });
                  }
                }}
                error={errors.nuevoDomicilio.calle}
                required />
              <Input label="Altura / Numeración" id="altura" value={data.nuevoDomicilio.altura}
                onChange={e => {
                  onChange('nuevoDomicilio', { ...data.nuevoDomicilio, altura: e.target.value })
                  if (e.target.value === '') {
                    onClientDataErrors({ ...errors, nuevoDomicilio: { ...errors.nuevoDomicilio, altura: 'Debes ingresar una altura.' } });
                  } else {
                    onClientDataErrors({ ...errors, nuevoDomicilio: { ...errors.nuevoDomicilio, altura: '' } });
                  }
                }}
                error={errors.nuevoDomicilio.altura}
                required />
              <Input label="Piso (opcional)" id="piso" value={data.nuevoDomicilio.piso} onChange={e => onChange('nuevoDomicilio', { ...data.nuevoDomicilio, piso: e.target.value })} />
              <Input label="Departamento (opcional)" id="departamento" value={data.nuevoDomicilio.departamento} onChange={e => onChange('nuevoDomicilio', { ...data.nuevoDomicilio, departamento: e.target.value })} />
              <Input label="Entre calle 1 (opcional)" id="entreCalle1" value={data.nuevoDomicilio.entreCalle1}
                onChange={e => {
                  const formattedCalle = formatearNombreCalle(e.target.value);
                  onChange('nuevoDomicilio', { ...data.nuevoDomicilio, entreCalle1: formattedCalle })
                }} />
              <Input label="Entre calle 2 (opcional)" id="entreCalle2" value={data.nuevoDomicilio.entreCalle2} onChange={e => {
                const formattedCalle = formatearNombreCalle(e.target.value);
                onChange('nuevoDomicilio', { ...data.nuevoDomicilio, entreCalle2: formattedCalle })
              }} />

              <div className="md:col-span-2">
                <Select label="Barrio" id="barrio" options={allBarriosOptions} value={data.nuevoDomicilio.barrioId} onChange={handleBarrioChange} emptyOptionLabel="Seleccione un barrio" error={errors.nuevoDomicilio.nuevoBarrioNombre} />
                {data.nuevoDomicilio.barrioId === 'NUEVO_BARRIO' && (
                  <div className="mt-2 p-3 bg-gray-700 rounded">
                    <Input label="Nombre del nuevo barrio" id="nuevoBarrioNombre" value={data.nuevoDomicilio.nuevoBarrioNombre} onChange={e => onChange('nuevoDomicilio', { ...data.nuevoDomicilio, nuevoBarrioNombre: e.target.value })} onKeyDown={handleNuevoBarrioKeyDown} placeholder="Escriba el nombre y presione Enter" required />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      

      <DomicilioSelectionModal
        isOpen={isDomicilioModalOpen}
        onClose={() => setIsDomicilioModalOpen(false)}
        domicilios={activeClientDomicilios}
        onSelectExisting={handleModalSelectExisting}
        onSelectNew={handleModalSelectNew}
      />
    </Card>
  );
};
export default ClientDataSection;
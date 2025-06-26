
import React, { useState, useEffect, useCallback } from 'react';
import Card from '../../common/Card';
import Input from '../../common/Input';
import Select from '../../common/Select';
import Button from '../../common/Button';
import Spinner from '../../common/Spinner';
import DomicilioSelectionModal from '../common/DomicilioSelectionModal'; // Import the modal
import { getTiposDocumento, getClientes, getServiciosConvergentes, getBarrios } from '../../../services/api';
import { TipoDocumento as TipoDocOption, Cliente, ClientDataState, ClientSearchFilters, Domicilio, TelefonoPrincipal, Barrio, SelectOption } from '../../../types';
import { useNotification } from '../../../hooks/useNotification';


interface ClientDataSectionProps {
  data: ClientDataState;
  onChange: <K extends keyof ClientDataState>(field: K, value: ClientDataState[K]) => void;
  onClientSelected: (client: Cliente | null) => void; 
}

const ClientDataSection: React.FC<ClientDataSectionProps> = ({ data, onChange, onClientSelected }) => {
  const [tiposDocumento, setTiposDocumento] = useState<TipoDocOption[]>([]);
  const [serviciosConvergentes, setServiciosConvergentes] = useState<SelectOption[]>([]);
  const [barriosOptions, setBarriosOptions] = useState<SelectOption[]>([]); 
  const [rawBarrios, setRawBarrios] = useState<Barrio[]>([]); 
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isDomicilioModalOpen, setIsDomicilioModalOpen] = useState(false); // Modal state
  
  const [searchFilters, setSearchFilters] = useState<ClientSearchFilters>({
    tipo_documento : '',
    numero_documento: '',
    apellido: '',
    nombre: ''
  });
  const [searchResults, setSearchResults] = useState<Cliente[]>([]);
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);
  const { showNotification } = useNotification();

  const [showNewBarrioInput, setShowNewBarrioInput] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false); // Control visibility of address input form

  const fetchInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [tdRes, scRes, bRes] = await Promise.all([
        getTiposDocumento(),
        getServiciosConvergentes(),
        getBarrios()
      ]);
      setTiposDocumento(tdRes);
      setServiciosConvergentes(scRes);
      setRawBarrios(bRes);
      setBarriosOptions(bRes.map((b: Barrio)  => ({ id: b.id.toString(), descripcion: b.nombre, activo: b.activo })));
    } catch (error) {
      console.error("Error fetching client section data:", error);
      showNotification("Error al cargar datos iniciales para cliente.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleSearchChange = <K extends keyof ClientSearchFilters,>(field: K, value: ClientSearchFilters[K]) => {
    setSearchFilters(prev => ({ ...prev, [field]: value }));
  };

  const resetAddressFields = useCallback(() => {
    onChange('nuevoDomicilio', { 
        calle: '', altura: '', entreCalle1: '', entreCalle2: '', 
        barrioId: '', nuevoBarrioNombre: '', 
        piso: '', departamento: '' 
    });
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
    onChange('nombre', client.nombre);
    onChange('apellido', client.apellido);
    onChange('email', client.correo_electronico || '');
    
    const principalPhones = client.telefonosPrincipales
      .filter(t => t.activo === 1)
      .sort((a,b) => new Date(b.fecha_modificacion).getTime() - new Date(a.fecha_modificacion).getTime())
      .map(t => ({ numero: t.numero_telefono }));
    onChange('telefonosPrincipales', principalPhones.length > 0 ? principalPhones : [{ numero: '' }]);
    onChange('telefonoSecundario', client.telefono_secundario || '');
    
    // Reset domicilio section when a new client is selected
    onChange('domicilioSeleccionadoId', ''); 
    resetAddressFields();
    setShowAddressForm(false); // Hide address form until an action is taken
  };
  
  const handleDomicilioButtonClick = () => {
    if (!selectedClient) {
        showNotification("Por favor, seleccione un cliente primero.", "info");
        return;
    }
    // Always open the modal. The modal will handle if there are addresses or not.
    setIsDomicilioModalOpen(true);
  };

  const handleModalSelectExisting = (domicilio: Domicilio) => {
    onChange('domicilioSeleccionadoId', domicilio.id.toString());
    onChange('nuevoDomicilio', {
      calle: domicilio.nombre_calle,
      altura: domicilio.numero_calle,
      entreCalle1: domicilio.entre_calle_1 || '',
      entreCalle2: domicilio.entre_calle_2 || '',
      barrioId: domicilio.barrio_id.toString(),
      nuevoBarrioNombre: '', 
      piso: domicilio.piso?.toString() || '', // Convert piso to string
      departamento: domicilio.departamento || '',
    });
    setIsDomicilioModalOpen(false);
    setShowAddressForm(true); // Show form populated with existing address
  };

  const handleModalSelectNew = () => {
    onChange('domicilioSeleccionadoId', 'NUEVO');
    resetAddressFields();
    setIsDomicilioModalOpen(false);
    setShowAddressForm(true); // Show form for new address input
  };
  
  const handleAddTelefonoPrincipal = () => {
    onChange('telefonosPrincipales', [...data.telefonosPrincipales, { numero: '' }]);
  };

  const handleRemoveTelefonoPrincipal = (index: number) => {
    const newTelefonos = data.telefonosPrincipales.filter((_, i) => i !== index);
    onChange('telefonosPrincipales', newTelefonos.length > 0 ? newTelefonos : [{ numero: '' }]);
  };

  const handleTelefonoPrincipalChange = (index: number, value: string) => {
    const newTelefonos = data.telefonosPrincipales.map((tel, i) => i === index ? { numero: value } : tel);
    onChange('telefonosPrincipales', newTelefonos);
  };

  const handleAddNewBarrio = () => {
    if (data.nuevoDomicilio.nuevoBarrioNombre.trim() === '') {
        showNotification("Ingrese un nombre para el nuevo barrio.", "error");
        return;
    }
    const newBarrioRaw: Barrio = { 
        id: Date.now(), 
        nombre: data.nuevoDomicilio.nuevoBarrioNombre.trim(), 
        activo: 1 
    };
    setRawBarrios(prev => [...prev, newBarrioRaw]);
    setBarriosOptions(prev => [...prev, {id: newBarrioRaw.id.toString(), descripcion: newBarrioRaw.nombre, activo: 1}]);
    onChange('nuevoDomicilio', { ...data.nuevoDomicilio, barrioId: newBarrioRaw.id.toString(), nuevoBarrioNombre: '' });
    setShowNewBarrioInput(false);
  };
  
  const activeClientDomicilios = selectedClient?.domicilios.filter(d => d.activo === 1) || [];

  if (isLoading) {
    return <Card title="Datos del Cliente"><div className="relative h-40"><Spinner fullScreen={false}/></div></Card>;
  }

  return (
    <Card title="Datos del Cliente" className="mb-6">
      {isSearching && <Spinner fullScreen={false}/>}
      <div className="mb-6 p-4 border border-dark-border rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-gray-200">Buscar Cliente Existente</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <Select
            label="Tipo Doc."
            id="searchTipoDoc"
            options={tiposDocumento.map(td => ({ id: td.id.toString(), descripcion: td.descripcion, activo: td.activo }))}
            value={searchFilters.tipo_documento}
            onChange={(e) => handleSearchChange('tipo_documento', e.target.value)}
            emptyOptionLabel="Todos"
          />
          <Input label="Nro. Doc." id="searchNroDoc" value={searchFilters.numero_documento} onChange={(e) => handleSearchChange('numero_documento', e.target.value)} />
          <Input label="Apellido" id="searchApellido" value={searchFilters.apellido} onChange={(e) => handleSearchChange('apellido', e.target.value)} />
          <Input label="Nombre" id="searchNombre" value={searchFilters.nombre} onChange={(e) => handleSearchChange('nombre', e.target.value)} />
        </div>
        <Button onClick={handleSearchClient} variant="secondary" disabled={isSearching}>
          {isSearching ? 'Buscando...' : 'Buscar Cliente'}
        </Button>
      </div>

      {searchResults.length > 0 && (
        <div className="mb-6 p-4 border border-dark-border rounded-lg bg-dark-input">
          <h4 className="text-md font-semibold mb-2 text-gray-200">Resultados de Búsqueda:</h4>
          <ul className="max-h-60 overflow-y-auto">
            {searchResults.map(client => (
              <li key={client.id} 
                  className="p-2 hover:bg-gray-700 cursor-pointer rounded"
                  onClick={() => handleSelectClient(client)}>
                {client.apellido}, {client.nombre} ({client.tipoDocumento?.descripcion}: {client.numero_documento})
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <h3 className="text-lg font-semibold mb-4 mt-6 text-gray-200">{selectedClient ? `Editando Cliente: ${selectedClient.nombre} ${selectedClient.apellido}` : 'Ingresar Nuevo Cliente'}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select label="Tipo de Documento" id="tipoDocumento" 
                options={tiposDocumento.map(td => ({ id: td.id.toString(), descripcion: td.descripcion, activo: td.activo }))} 
                value={data.tipoDocumentoId} onChange={e => onChange('tipoDocumentoId', e.target.value)} required emptyOptionLabel="Seleccione tipo"/>
        <Input label="Número de Documento" id="numeroDocumento" value={data.numeroDocumento} onChange={e => onChange('numeroDocumento', e.target.value)} required />
        <Input label="Nombre" id="nombre" value={data.nombre} onChange={e => onChange('nombre', e.target.value)} required />
        <Input label="Apellido" id="apellido" value={data.apellido} onChange={e => onChange('apellido', e.target.value)} required />
        
        <div className="md:col-span-2 space-y-3">
            <label className="block text-sm font-medium text-gray-300 mb-1">Teléfono/s de contacto principal</label>
            {data.telefonosPrincipales.map((tel, index) => (
                <div key={index} className="flex items-center gap-2">
                    <Input label="" id={`telPrincipal-${index}`} type="tel" value={tel.numero} onChange={e => handleTelefonoPrincipalChange(index, e.target.value)} placeholder="Número principal" className="flex-grow"/>
                    {data.telefonosPrincipales.length > 1 && <Button type="button" variant="danger" onClick={() => handleRemoveTelefonoPrincipal(index)} className="py-2 px-3 text-sm shrink-0">Eliminar</Button>}
                </div>
            ))}
            <Button type="button" variant="secondary" onClick={handleAddTelefonoPrincipal} className="text-sm py-2">+ Añadir teléfono</Button>
        </div>

        <Input label="Teléfono de contacto secundario (opcional)" id="telefonoSecundario" type="tel" value={data.telefonoSecundario} onChange={e => onChange('telefonoSecundario', e.target.value)} />
        <Input label="Correo electrónico (opcional)" id="email" type="email" value={data.email} onChange={e => onChange('email', e.target.value)} />
      </div>

      {/* Domicilio Section */}
      <div className="mt-6 pt-6 border-t border-dark-border">
          <h4 className="text-md font-semibold mb-3 text-gray-200">Domicilio del Cliente</h4>
          <Button 
              type="button" 
              variant="secondary" 
              className="mb-4 text-sm py-2" 
              onClick={handleDomicilioButtonClick}
              disabled={!selectedClient} // Button enabled only if a client is selected
          >
              Cargar Domicilio
          </Button>

          {showAddressForm && (
              <div className="space-y-4 p-4 border border-dark-border rounded-lg bg-dark-input mt-2">
                  <h5 className="text-sm font-semibold text-gray-300">
                      {data.domicilioSeleccionadoId === 'NUEVO' ? 'Datos del Nuevo Domicilio' : 'Editando Domicilio Seleccionado'}
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input label="Calle" id="calle" value={data.nuevoDomicilio.calle} onChange={e => onChange('nuevoDomicilio', {...data.nuevoDomicilio, calle: e.target.value})} required={data.domicilioSeleccionadoId === 'NUEVO'}/>
                      <Input label="Altura / Numeración" id="altura" value={data.nuevoDomicilio.altura} onChange={e => onChange('nuevoDomicilio', {...data.nuevoDomicilio, altura: e.target.value})} required={data.domicilioSeleccionadoId === 'NUEVO'} />
                      <Input label="Piso (opcional)" id="piso" value={data.nuevoDomicilio.piso} onChange={e => onChange('nuevoDomicilio', {...data.nuevoDomicilio, piso: e.target.value})} />
                      <Input label="Departamento (opcional)" id="departamento" value={data.nuevoDomicilio.departamento} onChange={e => onChange('nuevoDomicilio', {...data.nuevoDomicilio, departamento: e.target.value})} />
                      <Input label="Entre calle 1 (opcional)" id="entreCalle1" value={data.nuevoDomicilio.entreCalle1} onChange={e => onChange('nuevoDomicilio', {...data.nuevoDomicilio, entreCalle1: e.target.value})} />
                      <Input label="Entre calle 2 (opcional)" id="entreCalle2" value={data.nuevoDomicilio.entreCalle2} onChange={e => onChange('nuevoDomicilio', {...data.nuevoDomicilio, entreCalle2: e.target.value})} />
                  
                      <div className="md:col-span-2">
                          <Select 
                              label="Barrio" 
                              id="barrio" 
                              options={barriosOptions} 
                              value={data.nuevoDomicilio.barrioId} 
                              onChange={e => onChange('nuevoDomicilio', {...data.nuevoDomicilio, barrioId: e.target.value, nuevoBarrioNombre: ''})}
                              emptyOptionLabel="Seleccione un barrio"
                              required={data.domicilioSeleccionadoId === 'NUEVO'}
                          />
                          {!showNewBarrioInput && (
                              <Button type="button" variant="secondary" onClick={() => setShowNewBarrioInput(true)} className="mt-2 text-sm py-1 px-2">
                                  + Agregar nuevo barrio
                              </Button>
                          )}
                          {showNewBarrioInput && (
                              <div className="mt-2 p-3 bg-gray-700 rounded flex items-center gap-2">
                                  <Input 
                                      label="Nombre del nuevo barrio" 
                                      id="nuevoBarrioNombre" 
                                      value={data.nuevoDomicilio.nuevoBarrioNombre} 
                                      onChange={e => onChange('nuevoDomicilio', {...data.nuevoDomicilio, nuevoBarrioNombre: e.target.value})}
                                      className="flex-grow"
                                  />
                                  <Button type="button" variant="success" onClick={handleAddNewBarrio} className="text-sm py-1 px-2 shrink-0">Guardar Barrio</Button>
                                  <Button type="button" variant="danger" onClick={() => {setShowNewBarrioInput(false); onChange('nuevoDomicilio', {...data.nuevoDomicilio, nuevoBarrioNombre: ''})}} className="text-sm py-1 px-2 shrink-0">Cancelar</Button>
                              </div>
                          )}
                      </div>
                  </div>
              </div>
          )}
      </div>
      
      <div className="mt-6 pt-6 border-t border-dark-border grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="Horario de contacto" id="horarioContacto" value={data.horarioContacto} onChange={e => onChange('horarioContacto', e.target.value)} placeholder="Ej: 9-12hs y 14-18hs"/>
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">¿Convergencia?</label>
            <div className="flex items-center space-x-4">
                {(['Sí', 'No'] as const).map(option => (
                    <label key={option} className="flex items-center space-x-2 cursor-pointer">
                        <input type="radio" name="convergencia" value={option} checked={data.convergencia === option} 
                               onChange={e => onChange('convergencia', e.target.value as 'Sí' | 'No')}
                               className="form-radio h-4 w-4 text-brand-blue bg-dark-input border-dark-border focus:ring-brand-blue"
                        />
                        <span className="text-gray-300">{option}</span>
                    </label>
                ))}
            </div>
        </div>

        {data.convergencia === 'Sí' && (
          <div className="md:col-span-2">
            <label htmlFor="serviciosConvergentes" className="block text-sm font-medium text-gray-300 mb-1">
              Servicios Convergentes
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 border border-dark-border rounded-md bg-dark-input">
                {serviciosConvergentes.map(servicio => (
                    <label key={servicio.id} className="flex items-center space-x-2 cursor-pointer">
                        <input 
                            type="checkbox" 
                            value={servicio.id.toString()}
                            checked={data.serviciosConvergentesIds.includes(servicio.id.toString())}
                            onChange={e => {
                                const id = e.target.value;
                                const newIds = data.serviciosConvergentesIds.includes(id)
                                    ? data.serviciosConvergentesIds.filter(sid => sid !== id)
                                    : [...data.serviciosConvergentesIds, id];
                                onChange('serviciosConvergentesIds', newIds);
                            }}
                            className="form-checkbox h-4 w-4 text-brand-blue bg-dark-input border-dark-border rounded focus:ring-brand-blue"
                        />
                        <span className="text-sm text-gray-300">{servicio.descripcion}</span>
                    </label>
                ))}
            </div>
          </div>
        )}
      </div>
       <DomicilioSelectionModal
        isOpen={isDomicilioModalOpen}
        onClose={() => setIsDomicilioModalOpen(false)}
        domicilios={activeClientDomicilios} // Pass only active domicilios
        onSelectExisting={handleModalSelectExisting}
        onSelectNew={handleModalSelectNew}
      />
    </Card>
  );
};

export default ClientDataSection;

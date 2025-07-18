
import React, { useState, useEffect } from 'react';
import Select from '../../common/Select.js';
import Input from '../../common/Input.js';
import Spinner from '../../common/Spinner.js';
import { getGigas, getCompanias } from '../../../services/api.js';
import { SelectOption, PortabilidadState, Cliente, TelefonoPrincipal } from '../../../types.js';
import { useNotification } from '../../../hooks/useNotification.js';
import { validarTelefono } from '@/utils/validarDatosEntrada.js';

interface PortabilidadFormProps {
  data: PortabilidadState;
  onChange: <K extends keyof PortabilidadState>(field: K, value: PortabilidadState[K]) => void;
  selectedClient: Cliente | null;
}

const PortabilidadForm: React.FC<PortabilidadFormProps> = ({ data, onChange, selectedClient }) => {
  const [gigasOptions, setGigasOptions] = useState<SelectOption[]>([]);
  const [companiasOptions, setCompaniasOptions] = useState<SelectOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showNotification } = useNotification();
  const [errorNim, setErrorNim] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [gigasRes, companiasRes] = await Promise.all([
          getGigas(),
          getCompanias()
        ]);
        setGigasOptions(gigasRes);
        setCompaniasOptions(companiasRes);
        setErrorNim('El NIM es obligatorio y debe ser un teléfono de 10 dígitos. Ejemplo: 351XXXXXXX');

        
      } catch (error) {
        console.error("Error fetching Portabilidad form data:", error);
        showNotification("Error al cargar datos para Portabilidad.", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [showNotification]);

  useEffect(() => {
    if (selectedClient && selectedClient.telefonosPrincipales && selectedClient.telefonosPrincipales.length > 0) {
      let nimToPort = '';
      const activePrincipalPhones = selectedClient.telefonosPrincipales
        .filter(t => t.activo === 1)
        .sort((a, b) => new Date(b.fecha_modificacion).getTime() - new Date(a.fecha_modificacion).getTime());
      
      if (activePrincipalPhones.length > 0) {
        nimToPort = activePrincipalPhones[0].numero_telefono;
      }
      
      if (nimToPort) {
        onChange('nimAPortar', nimToPort);
      } else {
         onChange('nimAPortar', ''); // Clear if no suitable phone found
      }
    } else {
        onChange('nimAPortar', ''); // Clear if no client or no phones
    }
  }, [selectedClient, onChange]);


  if (isLoading) {
    return <div className="relative h-32"><Spinner fullScreen={false}/></div>;
  }

  return (
    <div className="space-y-6">
      <Input
        label="NIM a Portar"
        id="nimAPortar"
        value={data.nimAPortar}
        onChange={e => {
          onChange('nimAPortar', e.target.value)

          if (validarTelefono(e.target.value)) {
            setErrorNim('');
          } else {
            setErrorNim('Debe ingresar un teléfono de 10 dígitos. Ejemplo: 351XXXXXXX');
          }
        }}
        error={errorNim}
        required
      />
      <Select
        label="Gigas"
        id="gigasPortabilidad"
        options={gigasOptions}
        value={data.gigasId}
        onChange={e => onChange('gigasId', e.target.value)}
        emptyOptionLabel="Seleccione cantidad de Gigas"
        required
      />
      <Select
        label="Compañía Actual"
        id="companiaActual"
        options={companiasOptions}
        value={data.companiaActualId}
        onChange={e => onChange('companiaActualId', e.target.value)}
        emptyOptionLabel="Seleccione compañía actual"
        required
      />
    </div>
  );
};

export default PortabilidadForm;

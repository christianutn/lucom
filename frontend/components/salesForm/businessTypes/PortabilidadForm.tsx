
import React, { useState, useEffect } from 'react';
import Select from '../../common/Select.js';
import Input from '../../common/Input.js';
import Button from '@/components/common/Button.js';
import Spinner from '../../common/Spinner.js';
import { getGigas, getCompanias } from '../../../services/api.js';
import { SelectOption, PortabilidadState, Cliente } from '../../../types.js';
import { useNotification } from '../../../hooks/useNotification.js';
import { validarTelefono } from '@/utils/validarDatosEntrada.js';
import { CirclePlus, Trash } from 'lucide-react';

interface PortabilidadFormProps {
  data: PortabilidadState;
  onChange: <K extends keyof PortabilidadState>(field: K, value: PortabilidadState[K]) => void;
  selectedClient: Cliente | null;
  setNimError: (error: string) => void;
  nimError: string;
}

const PortabilidadForm: React.FC<PortabilidadFormProps> = ({ data, onChange, selectedClient, setNimError, nimError }) => {
  const [gigasOptions, setGigasOptions] = useState<SelectOption[]>([]);
  const [companiasOptions, setCompaniasOptions] = useState<SelectOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showNotification } = useNotification();

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
    if (selectedClient && selectedClient.telefono_principal) {
      const nimToPort = selectedClient.telefono_principal;
      if (nimToPort && data.nimAPortar.length === 0) { // Only set if no NIMs are present
        onChange('nimAPortar', [nimToPort]);
        setNimError('');
      }
    } else if (data.nimAPortar.length === 0) { // Ensure at least one empty input if no client or no phone
      onChange('nimAPortar', ['']);
    }
  }, [selectedClient, onChange, data.nimAPortar.length]);

  const handleNimChange = (index: number, value: string) => {
    const newNims = [...data.nimAPortar];
    newNims[index] = value;
    onChange('nimAPortar', newNims);

    // Validate all NIMs
    const allNimsValid = newNims.every(nim => validarTelefono(nim));
    if (allNimsValid) {
      setNimError('');
    } else {
      setNimError('Todos los números de NIM deben ser de 10 dígitos. Ejemplo: 351XXXXXXX');
    }
  };

  const addNimField = () => {
    onChange('nimAPortar', [...data.nimAPortar, '']);
  };

  const removeNimField = (index: number) => {
    const newNims = data.nimAPortar.filter((_, i) => i !== index);
    onChange('nimAPortar', newNims.length > 0 ? newNims : ['']); // Ensure at least one field remains
    if (newNims.length === 0) {
      setNimError('Debe ingresar al menos un número de NIM.');
    } else {
      const allNimsValid = newNims.every(nim => validarTelefono(nim));
      if (allNimsValid) {
        setNimError('');
      }
    }
  };

  if (isLoading) {
    return <div className="relative h-32"><Spinner /></div>;
  }

  return (
    <div className="space-y-6">
      <h4 className="text-md font-semibold mb-3 text-gray-200">Portabilidad</h4>
      {data.nimAPortar.map((nim, index) => (
        <div key={index} className="relative flex items-center mb-2">
          <div className="flex-grow">
            <Input
              id={`nimAPortar-${index}`}
              label={`NIM ${index + 1}`}
              value={nim}
              onChange={e => handleNimChange(index, e.target.value)}
              error={nimError && index === data.nimAPortar.length - 1 ? nimError : ''}
              className="w-full lg:w-[20ch]"
              required
            />
            {data.nimAPortar.length > 1 && (
              <Button
                type="button"
                onClick={() => removeNimField(index)}
                className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 ml-0 mt-1"
                title="Eliminar NIM"
              >
                <Trash size={17} />
              </Button>
            )}
          </div>

        </div>
      ))}
      <button
        type="button"
        onClick={addNimField}
        className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 mt-2"
        title="Agregar NIM"
      >
        <CirclePlus size={20} />
      </button>
      {nimError && data.nimAPortar.length === 0 && (
        <p className="text-red-500 text-sm mt-1">{nimError}</p>
      )}
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
        options={companiasOptions.sort((a, b) => a.descripcion.localeCompare(b.descripcion))}
        value={data.companiaActualId}
        onChange={e => onChange('companiaActualId', e.target.value)}
        emptyOptionLabel="Seleccione compañía actual"
        required
      />
    </div>
  );
};

export default PortabilidadForm;


import React, { useState, useEffect } from 'react';
import Select from '../../../common/Select.js';
import Input from '../../../common/Input.js';
import Button from '@/components/common/Button.js';
import Spinner from '../../../common/Spinner.js';
import { getGigas, getCompanias } from '../../../../services/api.js';
import { SelectOption, PortabilidadState, Cliente } from '../../../../types.js';
import { useNotification } from '../../../../hooks/useNotification.js';
import { validarTelefono } from '@/utils/validarDatosEntrada.js';
import { CirclePlus, Trash } from 'lucide-react';

interface PortabilidadFormProps {
  data: FormData;
  onChange: <K extends keyof PortabilidadState>(
    field: K,
    index: number,
    value: PortabilidadState[K]
  ) => void;
  index: number;
  onRemove: (index: number) => void;
  gigasOptions: SelectOption[];
  companiasOptions: SelectOption[];

}

type FormData = {
  nimAPortar: string;
  gigasId: string;
  companiaId: string;

};

const PortabilidadForm: React.FC<PortabilidadFormProps> = ({ data, onChange, index, onRemove, gigasOptions, companiasOptions }) => {

  const handleNimChange = (index: number, value: string) => {
    onChange('nimAPortar', index, value);
    if (validarTelefono(value)) {
      setErrorNim("");
      
    } else {
      setErrorNim("El número ingresado no es válido, debe contener 10 dígitos. Ejemplo: 351XXXXXXX")
    }

  }

  const removeNimField = (index: number) => {
    onRemove(index);

  }

  const [errorNim, setErrorNim] = useState("Debe ingresar un número de teléfono válido.");

  useEffect(() => {
    // Sincronizamos el estado de error con el valor actual de la prop `data.nimAPortar`
    if (validarTelefono(data.nimAPortar)) {
      setErrorNim("");
    } else {
      setErrorNim("Debe ingresar un número de teléfono válido.");
    }
  }, [data.nimAPortar]); // Este efecto se ejecuta cada vez que el NIM cambia


  return (
    <div className="space-y-6 mb-6 mb-6 p-4 border border-gray-700 rounded-lg bg-gray-800">
      <div className="flex items-center justify-between">
        <h4 className="text-md font-semibold text-gray-200">
          Portabilidad
        </h4>
        <Button
          type="button"
          onClick={() => removeNimField(index)}
          className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          title="Eliminar NIM"
        >
          <Trash size={17} />
        </Button>
      </div>

      <div key={index} className="relative flex items-center mb-2">
        <div className="flex-grow">
          <Input
            id={`nimAPortar-${index}`}
            label={`NIM ${index + 1}`}
            value={data.nimAPortar}
            onChange={e => handleNimChange(index, e.target.value)}
            className="w-full lg:w-[20ch]"
            error={errorNim}
            required
          />

        </div>

      </div>
      <Select
        label="Gigas"
        id="gigasPortabilidad"
        options={gigasOptions}
        value={data.gigasId}
        onChange={e => onChange('gigasId', index, e.target.value)}
        emptyOptionLabel="Seleccione cantidad de Gigas"
        required
      />
      <Select
        label="Compañía Actual"
        id="companiaActual"
        options={companiasOptions.sort((a, b) => a.descripcion.localeCompare(b.descripcion))}
        value={data.companiaId}
        onChange={e => onChange('companiaId', index, e.target.value)}
        emptyOptionLabel="Seleccione compañía actual"
        required
      />

    </div>
  );
};

export default PortabilidadForm;

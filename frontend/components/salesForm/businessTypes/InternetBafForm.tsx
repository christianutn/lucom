
import React, { useState, useEffect } from 'react';
import Select from '../../common/Select';
import Input from '../../common/Input';
import Spinner from '../../common/Spinner';
import { getTiposDomicilios, getAbonos, getTiposConvergencias } from '../../../services/api';
import { SelectOption, InternetBafState } from '../../../types';
import { useNotification } from '../../../hooks/useNotification';

interface InternetBafFormProps {
  data: InternetBafState;
  onChange: <K extends keyof InternetBafState>(field: K, value: InternetBafState[K]) => void;
}

const InternetBafForm: React.FC<InternetBafFormProps> = ({ data, onChange }) => {
  const [tiposDomicilio, setTiposDomicilio] = useState<SelectOption[]>([]);
  const [abonos, setAbonos] = useState<SelectOption[]>([]);
  const [tiposConvergencia, setTiposConvergencia] = useState<SelectOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [tdRes, abonosRes, tcRes] = await Promise.all([
          getTiposDomicilios(),
          getAbonos(),
          getTiposConvergencias()
        ]);
        setTiposDomicilio(tdRes);
        setAbonos(abonosRes);
        setTiposConvergencia(tcRes);
      } catch (error) {
        console.error("Error fetching Internet/BAF form data:", error);
        showNotification("Error al cargar datos para Internet/BAF.", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [showNotification]);

  if (isLoading) {
    return <div className="relative h-48"><Spinner fullScreen={false}/></div>;
  }

  return (
    <div className="space-y-6">
      <Select
        label="Tipo de Domicilio"
        id="tipoDomicilioBaf"
        options={tiposDomicilio}
        value={data.tipoDomicilioId}
        onChange={e => onChange('tipoDomicilioId', e.target.value)}
        emptyOptionLabel="Seleccione tipo de domicilio"
        required
      />
      <Select
        label="Abono"
        id="abonoBaf"
        options={abonos}
        value={data.abonoId}
        onChange={e => onChange('abonoId', e.target.value)}
        emptyOptionLabel="Seleccione un abono"
        required
      />
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">TVHD</label>
        <div className="flex items-center space-x-4">
            {(['Sí', 'No'] as const).map(option => (
                <label key={option} className="flex items-center space-x-2 cursor-pointer">
                    <input type="radio" name="tvhd" value={option} checked={data.tvhd === option} 
                           onChange={e => onChange('tvhd', e.target.value as 'Sí' | 'No')}
                           className="form-radio h-4 w-4 text-brand-blue bg-dark-input border-dark-border focus:ring-brand-blue"
                    />
                    <span className="text-gray-300">{option}</span>
                </label>
            ))}
        </div>
      </div>
      {data.tvhd === 'Sí' && (
        <Input
          label="Cantidad de decos"
          id="cantidadDecos"
          type="number"
          min="0"
          value={data.cantidadDecos}
          onChange={e => onChange('cantidadDecos', e.target.value)}
          required
        />
      )}
      <Select
        label="Tipo de Convergencia"
        id="tipoConvergenciaBaf"
        options={tiposConvergencia}
        value={data.tipoConvergenciaId}
        onChange={e => onChange('tipoConvergenciaId', e.target.value)}
        emptyOptionLabel="Seleccione tipo de convergencia"
      />
      <Input
        label="Línea Convergente"
        id="lineaConvergenteBaf"
        value={data.lineaConvergente}
        onChange={e => onChange('lineaConvergente', e.target.value)}
      />
    </div>
  );
};

export default InternetBafForm;
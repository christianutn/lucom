
import React, { useState, useEffect } from 'react';
import Select from '../../common/Select';
import Card from '../../common/Card';
import Spinner from '../../common/Spinner';
import { getTiposNegocios, getOrigenesDatos } from '../../../services/api';
import { SelectOption, InitialSelectionState } from '../../../types';

interface InitialSelectionSectionProps {
  data: InitialSelectionState;
  onChange: <K extends keyof InitialSelectionState>(field: K, value: InitialSelectionState[K]) => void;
  setTipoNegocioDescripcion: (descripcion: string) => void;
}

const InitialSelectionSection: React.FC<InitialSelectionSectionProps> = ({ data, onChange, setTipoNegocioDescripcion }) => {
  const [tiposNegocio, setTiposNegocio] = useState<SelectOption[]>([]);
  const [origenesDato, setOrigenesDato] = useState<SelectOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [tiposNegocioRes, origenesDatoRes] = await Promise.all([
          getTiposNegocios(),
          getOrigenesDatos()
        ]);
        setTiposNegocio(tiposNegocioRes);
        setOrigenesDato(origenesDatoRes);
      } catch (error) {
        console.error("Error fetching initial selection data:", error);
        // TODO: Show error notification to user
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleTipoNegocioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    onChange('tipoNegocioId', selectedId);
    const selectedOption = tiposNegocio.find(tn => tn.id.toString() === selectedId);
    if (selectedOption) {
      setTipoNegocioDescripcion(selectedOption.descripcion);
    } else {
      setTipoNegocioDescripcion('');
    }
  };


  if (isLoading) {
    return (
      <Card title="Selección Inicial">
        <div className="relative h-24"> {/* Placeholder for height */}
          <Spinner fullScreen={false}/>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Selección Inicial" className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Tipo de Negocio"
          id="tipoNegocio"
          options={tiposNegocio}
          value={data.tipoNegocioId}
          onChange={handleTipoNegocioChange}
          emptyOptionLabel="Seleccione un tipo de negocio"
          required
        />
        <Select
          label="Origen del Dato"
          id="origenDato"
          options={origenesDato}
          value={data.origenDatoId}
          onChange={(e) => onChange('origenDatoId', e.target.value)}
          emptyOptionLabel="Seleccione un origen"
          required
        />
      </div>
    </Card>
  );
};

export default InitialSelectionSection;
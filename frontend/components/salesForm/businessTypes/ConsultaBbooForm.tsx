
import React, { useState, useEffect } from 'react';
import Select from '../../common/Select.js';
import Input from '../../common/Input.js';
import Spinner from '../../common/Spinner.js';
import { getTiposDomicilios} from '../../../services/api.js';
import { SelectOption, ConsultaBbooState } from '../../../types.js';
import { useNotification } from '../../../hooks/useNotification.js';
import { validarTelefono } from '../../../utils/validarDatosEntrada';

interface ConsultaBbooFormProps {
  data: ConsultaBbooState;
  onChange: <K extends keyof ConsultaBbooState>(field: K, value: ConsultaBbooState[K]) => void;
}

const ConsultaBbooForm: React.FC<ConsultaBbooFormProps> = ({ data, onChange }) => {
  const [tiposDomicilio, setTiposDomicilio] = useState<SelectOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showNotification } = useNotification();
  const [errorTelefono, setErrorTelefono] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const tdRes = await getTiposDomicilios();
        setTiposDomicilio(tdRes);
        setErrorTelefono("Debe ingresar un teléfono de 10 dígitos. Ejemplo: 351XXXXXXX");
      } catch (error) {
        showNotification("Error al cargar datos para Internet/BAF.", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [showNotification]);

  if (isLoading) {
    return <div className="relative h-48"><Spinner fullScreen={false} /></div>;
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
      <Input
        label="LINEA CLARO A CONSULTAR (Todas las líneas PosPago masivo, ahora aplican a Convergencia, EXCLUYE LINEA FIJA)"
        id="lineaClaroAConsultar"
        type="text"
        value={data.lineaClaroAConsultar}
        onChange={e => {
          onChange('lineaClaroAConsultar', e.target.value)
          data.lineaClaroAConsultar = e.target.value;
          if (!validarTelefono(e.target.value)) {
            setErrorTelefono("El teléfono no es válido, debe ingresarse 10 dígitos.");
          } else {
            setErrorTelefono("");
          }
        }}
        error = {errorTelefono}
        required
      />
      <Input
        label="PEDIDO RELLAMADO Ingresar DNI. Si es urgente agregar la palabra ALERTA"
        id="pedidoRellamado"
        type="text"
        value={data.pedidoRellamado}
        onChange={e => onChange('pedidoRellamado', e.target.value)}
        required
      />
    </div>
  );
};

export default ConsultaBbooForm;
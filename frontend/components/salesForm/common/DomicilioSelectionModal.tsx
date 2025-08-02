
import React from 'react';
import { Domicilio } from '../../../types.js';
import Button from '../../common/Button.js';
import Card from '../../common/Card.js';

interface DomicilioSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  domicilios: Domicilio[];
  onSelectExisting: (domicilio: Domicilio) => void;
  onSelectNew: () => void;
}

const DomicilioSelectionModal: React.FC<DomicilioSelectionModalProps> = ({
  isOpen,
  onClose,
  domicilios,
  onSelectExisting,
  onSelectNew,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg bg-dark-card shadow-xl">
        <div className="max-h-60 overflow-y-auto mb-4 pr-2">
          {domicilios.map((dom) => (
            <div
              key={dom.id}
              className="p-3 mb-2 bg-dark-input hover:bg-gray-700 rounded-md cursor-pointer"
              onClick={() => onSelectExisting(dom)}
            >
              <p className="font-semibold text-gray-200">{`${dom.nombre_calle} ${dom.numero_calle}`}</p>
              <p className="text-sm text-gray-400">{dom.barrio?.nombre || 'Barrio no especificado'}</p>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <Button onClick={onSelectNew} variant="secondary" fullWidth>
            + Ingresar Nuevo Domicilio
          </Button>
          <Button onClick={onClose} variant="danger" fullWidth>
            Cancelar
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default DomicilioSelectionModal;


import React from 'react';
import { SelectOption as Option } from '../../types';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
  error?: string;
  emptyOptionLabel?: string; // e.g., "Seleccione una opción"
}

const Select: React.FC<SelectProps> = ({ label, id, options, error, className, emptyOptionLabel, ...props }) => {
  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>
      <select
        id={id}
        className={`bg-dark-input border ${error ? 'border-red-500' : 'border-dark-border'} text-white text-sm rounded-md focus:ring-brand-blue focus:border-brand-blue block w-full p-3 ${className}`}
        {...props}
      >
        {emptyOptionLabel && <option value="">{emptyOptionLabel}</option>}
        {options.map(option => (
          <option key={option.id} value={option.id}>
            {option.descripcion}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
};

export default Select;
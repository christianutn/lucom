import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id?: string;
  error?: string;
  icon?: React.ReactNode;
  className?: string;
}

const Input: React.FC<InputProps> = ({ label, id, error, icon, className = '', ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-400">
        {label}
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        {icon}
        <input
          id={id}
          name={id}
          className={`block w-full pl-10 pr-3 py-2 rounded-md bg-gray-700 border-gray-600 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${error ? 'border-red-500' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;

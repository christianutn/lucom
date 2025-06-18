
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', fullWidth = false, className, ...props }) => {
  let baseStyle = "font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg";
  
  if (fullWidth) {
    baseStyle += " w-full";
  }

  if (variant === 'primary') {
    baseStyle += " bg-brand-blue hover:bg-blue-700 text-white focus:ring-brand-blue";
  } else if (variant === 'secondary') {
    baseStyle += " bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500";
  } else if (variant === 'danger') {
    baseStyle += " bg-red-600 hover:bg-red-700 text-white focus:ring-red-500";
  } else if (variant === 'success') {
     baseStyle += " bg-green-600 hover:bg-green-700 text-white focus:ring-green-500";
  }


  if (props.disabled) {
    baseStyle += " opacity-50 cursor-not-allowed";
  }

  return (
    <button
      className={`${baseStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
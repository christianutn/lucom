
import React from 'react';

interface SpinnerProps {
  fullScreen?: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({ fullScreen = true }) => {
  const overlayClass = fullScreen 
    ? "fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50" 
    : "absolute inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-30";

  return (
    <div className={overlayClass}>
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-brand-blue"></div>
    </div>
  );
};

export default Spinner;
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-gray-800 shadow-lg rounded-lg p-6 ${className}`}>
      {children}
    </div>
  );
};

export default Card;

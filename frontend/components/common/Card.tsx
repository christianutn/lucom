
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, title, className }) => {
  return (
    <div className={`bg-dark-card p-6 rounded-lg shadow-md ${className}`}>
      {title && <h2 className="text-xl font-semibold text-gray-100 mb-4">{title}</h2>}
      {children}
    </div>
  );
};

export default Card;
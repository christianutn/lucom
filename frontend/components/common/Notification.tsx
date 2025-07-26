import React from 'react';
import { X } from 'lucide-react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose?: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  const baseClasses = 'p-4 rounded-md text-white flex items-center justify-between shadow-lg';
  const typeClasses = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  return (
    <div className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-50 ${baseClasses} ${typeClasses[type]}`}>
      <span className="mr-4">{message}</span>
      {onClose && (
        <button onClick={onClose} className="text-white hover:text-gray-100 focus:outline-none">
          <X size={20} />
        </button>
      )}
    </div>
  );
};

export default Notification;

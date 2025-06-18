
import React, { useEffect, useState } from 'react';
import { AppNotification as NotificationProps } from '../../types';


const Notification: React.FC<NotificationProps> = ({ message, type }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      // Auto-hide is handled by useNotification hook, this component just displays
    } else {
      setIsVisible(false);
    }
  }, [message]);

  if (!isVisible || !message) return null;

  let bgColor = 'bg-blue-500';
  if (type === 'success') bgColor = 'bg-green-500';
  if (type === 'error') bgColor = 'bg-red-500';
  if (type === 'info') bgColor = 'bg-sky-500';

  return (
    <div 
      className={`fixed top-5 right-5 ${bgColor} text-white p-4 rounded-lg shadow-lg z-[100] transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      role="alert"
    >
      {message}
    </div>
  );
};

export default Notification;
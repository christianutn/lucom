
import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';
import { AppNotification } from '../types.js';

interface NotificationContextType {
  notification: AppNotification | null;
  showNotification: (message: string, type: AppNotification['type'], duration?: number) => void;
  hideNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notification, setNotification] = useState<AppNotification | null>(null);
  const [timeoutId, setTimeoutId] = useState<number | null>(null); // Changed NodeJS.Timeout to number

  const hideNotification = useCallback(() => {
    setNotification(null);
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  }, [timeoutId]);

  const showNotification = useCallback((message: string, type: AppNotification['type'], duration: number = 3000) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setNotification({ message, type });
    const newTimeoutId = setTimeout(() => {
      hideNotification();
    }, duration);
    setTimeoutId(newTimeoutId as unknown as number); // Cast to number if environments differ significantly, or ensure ReturnType<typeof setTimeout>
  }, [hideNotification, timeoutId]);


  return (
    <NotificationContext.Provider value={{ notification, showNotification, hideNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
import React, { createContext, useState, useEffect, ReactNode } from 'react';

type Alert = {
  uid: string;
  time: string;
};

type AlertContextType = {
  alerts: Alert[];
  addAlert: (alert: Alert) => void;
};

export const AlertContext = createContext<AlertContextType>({
  alerts: [],
  addAlert: () => {},
});

type Props = {
  children: ReactNode;
};

export const AlertProvider: React.FC<Props> = ({ children }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const addAlert = (alert: Alert) => {
    setAlerts(prev => [alert, ...prev]);
  };

  // For demo, add fake alerts every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      const newAlert: Alert = {
        uid: 'UNKNOWN_' + Math.floor(Math.random() * 9999),
        time: new Date().toLocaleString(),
      };
      addAlert(newAlert);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AlertContext.Provider value={{ alerts, addAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

"use client"

import React, {
  useEffect,
  useState,
} from 'react';

import { X } from 'lucide-react';

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast';

interface Alert {
  id: number;
  message: {
    title: string;
    description: string;
  };
  isLoading: boolean;
}

interface AlertDemoProps {
  alerts?: Alert[]; 
}

export function AlertDemo({ alerts = [] }: AlertDemoProps) { 
  const [currentAlerts, setCurrentAlerts] = useState<Alert[]>(alerts);

  useEffect(() => {
    if (alerts.length === 0) {
      const defaultAlert: Alert = {
        id: Date.now(),
        message: {
          title: 'Sucesso!',
          description: 'Conectado ao sistema.',
        },
        isLoading: false,
      };
      setCurrentAlerts([defaultAlert]);
    } else {
      setCurrentAlerts(alerts);
    }
  }, [alerts]);

  const handleClose = (id: number) => {
    setCurrentAlerts((prevAlerts) => prevAlerts.filter(alert => alert.id !== id));
  };

  return (
    <ToastProvider>
      <ToastViewport />
      {currentAlerts.map((alert) => (
        <Toast key={alert.id}>
          <ToastTitle>{alert.message.title}</ToastTitle>
          <ToastDescription>{alert.message.description}</ToastDescription>
          <ToastClose onClick={() => handleClose(alert.id)}>
            <X className="h-4 w-4" />
          </ToastClose>
        </Toast>
      ))}
    </ToastProvider>
  );
}

export default AlertDemo;

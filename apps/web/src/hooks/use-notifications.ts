import { useState, useEffect } from 'react';

export interface Notification {
  id: string; 
  message: string;
  read: boolean;
  description?: string; 
  createdAt?: string; 
  recordId?: string; 
  type?: string; 
  from?: string; 
  to?: string; 
}

export const getNotifications = async (): Promise<Notification[]> => {
  return new Promise<Notification[]>((resolve) => {
    setTimeout(() => {
      const notifications: Notification[] = [
        { 
          id: '1', 
          message: 'Novo comentário na sua postagem', 
          read: false, 
          description: "Novo comentário na sua postagem", 
          createdAt: new Date().toISOString(),
          recordId: 'record_1',
          type: 'inbox', 
          from: 'Usuário A', 
          to: 'Usuário B', 
        },
        { 
          id: '2', 
          message: 'Seu post foi curtido', 
          read: true, 
          description: "Seu post foi curtido por Usuário C", 
          createdAt: new Date().toISOString(),
          recordId: 'record_2',
          type: 'inbox', 
          from: 'Usuário C', 
          to: 'Usuário B', 
        },
     
      ];
      resolve(notifications); 
    }, 1000);
  });
};


interface UseNotificationsReturn {
  notifications: Notification[];
  hasUnseenNotifications: boolean;
  markMessageAsRead: (id: string) => void;
  markAllMessagesAsRead: () => void;
  markAllMessagesAsSeen: () => void;
  loading: boolean;
  error: Error | null;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasUnseenNotifications, setHasUnseenNotifications] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true); 
      setError(null); 

      try {
        const data = await getNotifications(); 
        setNotifications(data); 
        setHasUnseenNotifications(data.some(notification => !notification.read));
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false); 
      }
    };

    fetchNotifications();
  }, []);

  const markMessageAsRead = (id: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllMessagesAsRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => ({ ...notification, read: true }))
    );
  };

  const markAllMessagesAsSeen = () => {
    setHasUnseenNotifications(false);
  };

  return {
    notifications,
    hasUnseenNotifications,
    markMessageAsRead,
    markAllMessagesAsRead,
    markAllMessagesAsSeen,
    loading, 
    error, 
  };
};

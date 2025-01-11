'use client';

import {
  useEffect,
  useState,
} from 'react';

import { format } from 'date-fns';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useUserData } from '@/hooks/userDate';
import {
  app,
  collection,
  getFirestore,
  onSnapshot,
} from '@neo/firebase';

import { SheetDemo } from './webhoook-log-contet';

interface WebhookLog {
  id: string;
  event: string;
  url: string;
  delayInSeconds: string;
  body: any;
  timestamp: any;
}

function getEmailDomain(email: string): string {

  const parts = email.split('@')[1].split('.')[0];
  return  parts;
}

function isSameDomain(email1: string, email2: string): boolean {
  return getEmailDomain(email1) === getEmailDomain(email2);
}

export default function Logs() {
  const { user: userData, isLoading, isError, errorUser } = useUserData();
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const db = getFirestore(app);

  const email = userData?.email;

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'webhooks'), (querySnapshot) => {
      setLoading(true);
      setError(null);
      try {
        const logs: WebhookLog[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as WebhookLog[];

        const filteredLogs = logs.filter(log => {
          const detailsEmail = log.body?.details;
          return detailsEmail && email && isSameDomain(detailsEmail, email);
        });

        setWebhookLogs(filteredLogs);
      } catch (error) {
        console.error('Erro ao carregar os logs dos webhooks:', error);
        setError('Falha ao carregar os logs dos webhooks. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [db, email]);

  return (
    <div className="w-full flex justify-center p-10">
      <div className="w-full max-w-4xl">
        <Table>
          <TableCaption>A lista de Logs do Webhooks.</TableCaption>
          <TableHeader className="border">
            <TableRow>
              <TableHead className="w-[100px]">Metodo</TableHead>
              <TableHead className="w-[100px]">Event</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Body</TableHead>
              <TableHead className="text-right">Duração </TableHead>
              <TableHead className="text-right">Timestamp</TableHead>
            </TableRow>
          </TableHeader>

          {loading ? (
            <div>Carregando...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <TableBody>
              {webhookLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>POST</TableCell>
                  <TableCell className="font-medium">{log.event}</TableCell>
                  <TableCell>{log.url}</TableCell>
                  <TableCell>
                    <SheetDemo body={log.body} />
                  </TableCell>
                  <TableHead className="text-right">{log.delayInSeconds}s</TableHead>
                  <TableCell className="text-right">
                    {format(log.timestamp?.toDate(), 'PPPpp')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </div>
    </div>
  );
}

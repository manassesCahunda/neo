import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { app, getFirestore, doc, setDoc, collection, query, orderBy,onSnapshot } from '@neo/firebase';

const db = getFirestore(app);

export const Notifications = createTRPCRouter({
  pushNotifications: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, "ID must be at least 3 characters."),
        read: z.string().min(5, "Email must be at least 5 characters.").max(50, "Email must be at most 50 characters.").email("Invalid email."),
        createdAt: z.string().min(3, "Creation date must be at least 10 characters."),
        payload: z.object({
          description: z.string().min(5, "Description must be at least 5 characters.").max(200, "Description must be at most 200 characters."),
          recordId: z.string().min(3, "Record ID must be at least 3 characters.").max(20, "Record ID must be at most 20 characters."),
          type: z.string().min(3, "Type must be at least 3 characters.").max(20, "Type must be at most 20 characters."),
        })
      })
    )
    .mutation(async ({ input }) => {
      const { id, read, createdAt, payload } = input;
      try {
        await setDoc(doc(db, 'Notifications', id), {
          id,
          read,
          created_at: createdAt,
          payload,
        });
        return { message: 'Worker criado com sucesso!' };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao criar worker',
          cause: error,
        });
      }
    }),

  getNotifications: protectedProcedure
    .query(async () => {
      try {
        const notificationsCollection = collection(db, 'Notifications');
        const notificationsQuery = query(notificationsCollection, orderBy('created_at', 'desc')); // 'desc' para ordem decrescente

        const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
          const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          console.log('Notificações atualizadas:', notifications);
        }, (error) => {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Erro ao escutar notificações',
            cause: error,
          });
        });
        return {
          message: 'Escutando notificações',
          unsubscribe,
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao configurar escuta de notificações',
          cause: error,
        });
      }
    }),
});

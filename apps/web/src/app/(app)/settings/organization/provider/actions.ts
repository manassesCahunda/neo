import { z } from 'zod';
import { createServerAction } from 'zsa';

import { acessEmail } from '@/action/acess-email';

export const conviteLink = createServerAction()
  .input(
    z.object({
      email: z.string().email(),
      companyId: z.string(),
      companyName: z.string(),
      userProvider:z.string()
    })
  )
  .handler(async ({ input }) => {
    const { email, companyId, companyName ,userProvider } = input;

    try {
      console.log('Input recebido:', { email, companyId, companyName });
      const convite = await acessEmail(email, companyId, companyName ,userProvider);
      if (!convite.success) {
        console.error('acessEmail não retornou um convite válido.');
        return {
          success: false,
          message: 'Ocorreu um erro ao buscar a empresa. Tente novamente.',
        };
      }
      return convite;
    } catch (error) {
      console.error('Erro no envio do convite:', error);
      return {
        success: false,
        message: 'Ocorreu um erro interno ao enviar o convite.',
      };
    }
  });

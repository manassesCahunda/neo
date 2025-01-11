import { z } from 'zod';

export const updateCompanySchema = z.object({
  id: z.string({ message: "ID é obrigatório e não pode ser vazio" }).optional(),
  domain: z.string({ message: "O domínio deve ser um email válido" }).optional(),
  name: z.string({ message: "Nome da empresa é obrigatório" }).optional(),
  host: z.string({ message: "Host é obrigatório" }).optional(),
  key: z.string({ message: "Chave é obrigatória" }).optional(),
  externalId: z.string({ message: "External ID é obrigatório" }).optional(),
});


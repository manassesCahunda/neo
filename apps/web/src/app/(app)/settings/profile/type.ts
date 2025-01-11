import { z } from 'zod';

export const user = z.object({
  name: z.string()
    .min(5, { message: 'Nome deve ter pelo menos 5 caracteres.' }),  
  email: z.string()
    .min(5)
    .email({ message: 'Email inválido' }),
  role: z.string().optional(),
  image: z.any().optional(),
  password: z.string().nullable().optional(),
})

/**
 * A função `signUpAction` lida com o registro de usuários, validando os dados fornecidos,
 * criando uma conta usando `serverClient.createAccount` e gerando um token de acesso.
 * Ela também gerencia o ID da empresa com base em cookies, trata erros e responde com base no sucesso ou falha.
 */

'use server';

import { HTTPError } from 'ky';
import { cookies } from 'next/headers';
import { z } from 'zod';

import { serverClient } from '@/lib/trpc/server';

const signUpSchema = z
  .object({
    name: z.string().refine((value) => value.split(' ').length > 1, {
      message: 'Por favor, insira seu nome completo',
    }),
    email: z.string().email({ message: 'Por favor, forneça um endereço de e-mail válido.' }),
    password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'A confirmação da senha não corresponde.',
    path: ['password_confirmation'],
  });

export async function signUpAction(data: FormData) {
  const result = signUpSchema.safeParse(Object.fromEntries(data));

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return { success: false, message: null, errors };
  }

  const { name, email, password } = result.data;

  const cookieStore = await cookies();
  const companyIdCookie = cookieStore.get('companyId');

  const role = cookieStore.get('role')?.value || 'Owner';

  if (!companyIdCookie?.value) {
    return { success: false, message: 'ID da empresa não encontrado nos cookies.', errors: null };
  }

  const companyId = companyIdCookie.value;
  const passwordHash = password;

  try {
    const user = await serverClient.createAccount({
      name,
      email,
      passwordHash,
      companyId,
      role,
    });

    if (!user) {
      return { success: false, message: 'Erro ao criar o usuário. Por favor, tente novamente mais tarde.', errors: null };
    }

    const token = await serverClient.acessToken({ address: email });

    if (!token) {
      return { success: false, message: 'Erro ao fornecer o token.', errors: null };
    }

    cookieStore.delete('companyId');

    return {
      success: true,
      message: 'Cadastro realizado com sucesso! Por favor, verifique seu e-mail para confirmar sua conta.',
      errors: null,
    };

  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json();
      return { success: false, message, errors: null };
    }

    console.error(err);
    return {
      success: false,
      message: 'Erro inesperado, por favor tente novamente em alguns minutos.',
      errors: null,
    };
  }
}

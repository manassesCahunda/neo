'use server';

import { z } from 'zod';
import { createServerAction } from 'zsa';

import { Adapter } from '@neo/auth';

import { updateCompanySchema } from './type';

export const queryCompany = createServerAction()
  .input(
    z.object({
      email: z.string().email(),
    })
  )
  .handler(async ({ input }) => {
    const { email: domain } = input;

    try {
      const company = await Adapter.queryCompany({ domain });

      if (!company) {
        return {
          success: false,
          message: 'Empresa não encontrada.',
        };
      }

      const members = await Adapter.getAllUser(company.id);

      company.members = members || [];

      return company;
    } catch (error) {
      console.error('Erro ao buscar a empresa:', error);
      return {
        success: false,
        message: 'Ocorreu um erro ao buscar a empresa: ' + error.message,
      };
    }
  });

  export const updateCompany = createServerAction()
  .input(updateCompanySchema)
  .handler(async ({ input }) => {
    const { name, domain, host, key, id, externalId } = input;

  
    try {

      const company = await Adapter.updateCompany({
        id,
        name,
        domain,
        host,
        key,
        xauth: "some-authorization-token",
        externalId,
      });

      if (!company) {
        return {
          success: false,
          message: "Empresa não encontrada ou atualização falhou.",
        };
      }

      const members = await Adapter.getAllUser(company?.id);
      company.members = members || [];

      return company;
    } catch (error) {
      console.error("Erro ao atualizar a empresa:", error);
      return {
        success: false,
        message: `Ocorreu um erro ao atualizar a empresa: ${error.message}`,
      };
    }
  });


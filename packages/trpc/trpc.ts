import SuperJSON from 'superjson';
import { ZodError } from 'zod';

import { authorized } from '@neo/auth';
import {
  initTRPC,
  TRPCError,
} from '@trpc/server';

type TRPCContext = {
  token?: string;
  refreshToken?: string;
  sessionId?: string;
  currentUrl?: string;
};

const t = initTRPC.context<TRPCContext>().create({
  transformer: SuperJSON,
  errorFormatter({ shape, error }) {
    console.error('TRPC Error:', error);
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const {
  router: createTRPCRouter,
  procedure: publicProcedure,
  createCallerFactory,
  middleware,
  mergeRouters,
} = t;

export const protectedProcedure = publicProcedure.use(async ({ ctx, next }) => {
  
  const { refreshToken, sessionId, token,currentUrl} = ctx;
  const containsAuth = currentUrl?.includes('/auth');

  if(refreshToken && !containsAuth ){

      const authResult = await authorized({ refreshToken, token, sessionId });

      if (authResult.status === 401) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: authResult.message,
        });
      }

      if (authResult.status === 403) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: authResult.message,
        });
      }
      

      if (!authResult) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: authResult.message,
        });
      }
      
      return next({
        ctx: {
          ...ctx,
          token: authResult.token ?? null,
          refreshToken: authResult.refreshToken ?? null,
          sessionId: authResult.sessionId ?? null,
        },
      });

    }

    return next({
      ctx: {
        ...ctx,
        token: null,
        refreshToken: null,
        sessionId: null,
      },
    });
});

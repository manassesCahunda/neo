import type { AppRouter } from '@neo/trpc';

import { createTRPCReact } from '@trpc/react-query';

export const trpc = createTRPCReact<AppRouter>()

export const TRPCProvider = trpc.Provider
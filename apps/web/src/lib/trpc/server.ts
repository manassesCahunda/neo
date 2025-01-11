import 'server-only';

import { cookies } from 'next/headers';

import {
  appRouter,
  createCallerFactory,
} from '@neo/trpc';

export const serverClient = createCallerFactory(appRouter)(async () => {
  
  const cookieStore = await  cookies();

  const token = cookieStore.get('token');
  const sessionId = cookieStore.get('sessionId');
  const refreshToken = cookieStore.get('refreshToken');
  const currentUrl = cookieStore.get('currentUrl');

  return {
    sessionId: sessionId?.value || null,
    token: token?.value || null,
    refreshToken: refreshToken?.value || null, 
    currentUrl: currentUrl?.value || null 
  };
});

import {
  NextRequest,
  NextResponse,
} from 'next/server';

import { appRouter } from '@neo/trpc';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

const handler = async (req: NextRequest) => {
  try {

    const response = await fetchRequestHandler({
      endpoint: '/api/trpc',
      req,
      router: appRouter,
      onError: ({ error }:any) => {
        console.error('Error:', error);
        if (error.code=== 'INTERNAL_SERVER_ERROR') {
        }
      },
    });

    return new NextResponse(response.body, {
      headers: response.headers,
      status: response.status,
      statusText: response.statusText,
    });
  } catch (err) {
    console.error(err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
};

export const runtime = 'nodejs';
export const preferredRegion = 'cle1';
export { handler as GET, handler as POST };

// passa este padrao para cada metodo 
// criar um padrao de o que vai ser passados em cada rotas
// Middleware e oferece suporte  APIs: APIs de rede, APIs de fluxo, APIs de criptografia e APIs padrão da Web.
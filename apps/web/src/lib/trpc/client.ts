import { AppRouter } from '@neo/trpc'
import { createTRPCClient, httpBatchLink, TRPCLink } from '@trpc/client'
import SuperJSON from 'superjson'

//pegar a url actual
function getBaseUrl() {
  if (typeof window !== 'undefined') return ''
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return `http://localhost:${process.env.PORT ?? 3000}`
}

//passar url aualiza a rota api no backend
export function getUrl() {
  return getBaseUrl() + '/api/trpc'
}

//passar formatar a api  qualquer valor (object , "array")  passado vira um json 
export const trpcLinks: TRPCLink<AppRouter>[] = [
  httpBatchLink({
    url: getUrl(),
    transformer: SuperJSON,
    fetch(url:any, options:any) {
      return fetch(url, {
        ...options,
        credentials: 'include',
      });
    },
  }),
]

export const nativeClient = createTRPCClient<AppRouter>({
  links: trpcLinks,
})
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

//chamadas de routas
import { user } from './routers/user'
import { Upload } from './routers/upload'
import { Notifications } from './routers/notifications'
import { company } from './routers/company'

//chamadas do lado servidor a para chamadas as rotas nos serve compomente direitamente 
import { createCallerFactory, mergeRouters } from './trpc'

//aplicando a rotas container instancia das sservidor routes
export const appRouter = mergeRouters(
  user,
  Upload,
  Notifications,
  company
)

export { createCallerFactory }

export type AppRouter = typeof appRouter
export type RouterInputs = inferRouterInputs<AppRouter>
export type RouterOutput = inferRouterOutputs<AppRouter>
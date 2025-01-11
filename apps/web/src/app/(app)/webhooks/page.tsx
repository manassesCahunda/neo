import { Suspense } from 'react';

import { ClipboardCopy } from 'lucide-react';

import WebhooksList from '@/app/(app)/webhooks/webhooks-list';
import WebhooksListLoading from '@/app/(app)/webhooks/webhooks-list-loading';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

import WebhooksButton from './webhook.button';

export default async function Webhooks() {
  return (
    <Card className="w-6/6  m-16">
      <CardHeader>
        <CardTitle>Desenvolvedores</CardTitle>
        {/* <CardDescription>
          Brevemente diaponivel Conecte seu aplicativo através dos nossos webhooks.
        </CardDescription> */}
      </CardHeader>
      <CardContent>
        
        <div className="space-y-4">
         <div className="space-y-2">
          <Label htmlFor="apiUrl">URL da API</Label>
          <Input
            name="apiUrl"
            id="apiUrl"
            defaultValue="https://upload.rocketseat.com.br/api/v1"
            disabled
          />
            <p className="text-[0.8rem] text-muted-foreground">
              Acesse nossa{' '}
              <a href="#" className="underline">
                documentação
              </a>{' '}
              para entender como utilizar nossa API.
            </p>
            <p className="text-sm text-orange-600 mt-2">
              <strong>Em breve!</strong> A funcionalidade de integração estará disponível em breve.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiKey">Chave da API</Label>
            <div className="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 focus-within:ring-2 focus-within:ring-zinc-400 focus-within:ring-offset-2 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950">
              <input
                id="apiKey"
                className="h-10 flex-1 bg-transparent py-2 text-sm outline-none"
                readOnly
                defaultValue={'*'.repeat(48)}
              />
              <Button variant="secondary" size="xs">
                <ClipboardCopy className="mr-1.5 size-3" />
                Clique para copiar
              </Button>
            </div>
            <p className="text-sm text-orange-600 mt-2">
              <strong>Em breve!</strong> A geração de chave API será liberada em breve para uso.
            </p>
          </div>
          <Separator />

          <Suspense fallback={<WebhooksListLoading />}>
            <WebhooksList /> 
          </Suspense>  

          <Separator />

          <div className="space-x-3">
           <WebhooksButton/>
          </div>
        </div>

      </CardContent>
    </Card>
  )
}

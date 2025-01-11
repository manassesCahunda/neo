'use client';

import { Globe } from 'lucide-react';

import { queryWebhook } from '@/action/webhook';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useQuery } from '@tanstack/react-query';

import { WebhookForm } from './webhook-form';
import WebhooksListLoading from './webhooks-list-loading';

// const WebhookEventsChart = dynamic(() => import('./webhook-events-chart'), { ssr: false });

export default function WebhooksList() {
  const { data: webhooksData, isLoading, isError, error } = useQuery({
    queryKey: ['webhooks'],
    queryFn: () => {
     return queryWebhook().then(response => {
        return response; 
    });
  }});

  if (isLoading) {
    return <WebhooksListLoading />;
  }

  if (isError) {
    return <div>Error: {error instanceof Error ? error.message : 'Unknown error'}</div>;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <Label asChild>
            <span>Webhooks</span>
          </Label>
          <p className="pt-4 text-[0.8rem] text-muted-foreground">
            Ouça eventos no seu aplicativo.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Separator orientation="vertical" className="h-4" />
          <WebhookForm /> 
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead style={{ width: 200 }}>URL</TableHead>
              <TableHead style={{ width: 120 }}>Canais</TableHead>
              <TableHead style={{ width: 120 }}>Eventos</TableHead>
              {/* <TableHead style={{ width: 164 }}>
                <div className="flex flex-col">
                  <span>Eventos (últimos 7 dias)</span>
                </div>
              </TableHead> */}
              <TableHead style={{ width: 64 }}>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {webhooksData?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Nenhum webhook criado.
                </TableCell>
              </TableRow>
            )}
            {webhooksData?.map((webhook, index) => (
              <TableRow key={index}>
                <TableCell className="py-1.5">
                  <div className="flex items-center gap-1">
                    <Globe className="size-4 flex-shrink-0" />
                    <span className="truncate whitespace-nowrap font-medium">{webhook.url}</span>
                  </div>
                </TableCell>
                <TableCell className="py-1.5">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="underline">{webhook.channels}</TooltipTrigger>
                      <TooltipContent className="max-w-96 text-center font-mono text-xs leading-relaxed">
                        {webhook.channels || 'Sem eventos'}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell className="py-1.5">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="underline">{webhook.eventType} evento(s)</TooltipTrigger>
                      <TooltipContent className="max-w-96 text-center font-mono text-xs leading-relaxed">
                        {webhook.eventType || 'Sem eventos'}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
 
                <TableCell className="py-5">
                  <div className="flex items-center gap-2">
                    {webhook.status ? (
                      <>
                        <span className="size-2 shrink-0 rounded-full bg-violet-400" />
                        <span className="text-xs font-semibold">ATIVO</span>
                      </>
                    ) : (
                      '-'
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

 
               {/* <TableCell className="py-1.5">
                  <WebhookEventsChart data={webhook.amountOfLogs} />
                </TableCell> */}
{/* <TableCell className="py-1.5">
                    <WebhookEventsChart data={webhook.amountOfLogs} />
                  </TableCell>  */}
               {/* <div className="flex items-center justify-end space-x-2">
                      <WebhookListItemActions webhook={webhook} />
                    </div> */}

{/*  {webhooksData.length > 0 ? (
            <span className="text-sm text-muted-foreground">
              Página {page} de {Math.ceil(webhooksData.length / 10)}
            </span>
          ) : (
            <>
            </>
          )}
          <Separator orientation="vertical" className="h-4" />
       
                       <Skeleton className="h-5 w-20" />
                       <Button
            variant="outline"
            className="size-8 p-0"
            onClick={() => navigateToPage(pageIndex - 1)}
            disabled={!hasPreviousPage}
          >
            <span className="sr-only">Ir para a página anterior</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="size-8 p-0"
            onClick={() => navigateToPage(pageIndex + 1)}
            disabled={!hasNextPage}
          >
            <span className="sr-only">Ir para a próxima página</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button> */}
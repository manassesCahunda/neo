'use client';

import * as React from 'react';

import {
  Loader2,
  Plus,
} from 'lucide-react';
import {
  FormProvider,
  useForm,
} from 'react-hook-form';
import { z } from 'zod';

import { createWebhooks } from '@/action/webhook';
import { AlertDemo } from '@/components/toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

export const createWebhookSchema = z.object({
  name: z.string().min(1, { message: 'Nome é obrigatório' }),
  url: z.string().url({ message: 'Digite uma URL válida.' }),
  channels: z.string().min(1, { message: 'Canais são obrigatórios' }),
  eventType: z.string().min(1, { message: 'Tipo de evento é obrigatório' }),
  status: z.string().refine(val => val === 'true' || val === 'false', {
    message: 'Campo obrigatório',
  }).transform(val => val === 'true'),
});

export type CreateWebhookSchema = z.infer<typeof createWebhookSchema>;

interface WebhookFormProps {
  webhookToEdit?: CreateWebhookSchema;
}

export const WebhookForm = ({ webhookToEdit }: WebhookFormProps) => {
  const [alerts, setAlerts] = React.useState<{
    id: number;
    message: { title: string; description: string };
    isLoading?: boolean;
  }[]>([]);
  const webhookForm = useForm<CreateWebhookSchema>({
    resolver: zodResolver(createWebhookSchema),
    defaultValues: webhookToEdit,
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateWebhookSchema) => {
      return createWebhooks(data).then(response => {
        return response;
      });
    },
    onSuccess: (newWebhook) => {
      queryClient.setQueryData(['webhooks'], (oldData: any[]) => {
        return [...oldData, newWebhook];
      });
      setAlerts(prev => [
        ...prev,
        { id: Date.now(), message: { title: 'Sucesso!', description: 'Webhook criado com sucesso!' }, isLoading: false },
      ]);
      webhookForm.reset();
    },
    onError: () => {
      setAlerts(prev => [
        ...prev,
        { id: Date.now(), message: { title: 'Erro!', description: 'Ocorreu um erro ao tentar salvar o webhook.' }, isLoading: false },
      ]);
    },
  });
  
  const handleSaveWebhook = async (data: CreateWebhookSchema) => {
    try {
      const { name, url, channels, eventType, status } = data;
      mutation.mutate({ name, url, channels, eventType, status });

    } catch (error) {
      setAlerts(prev => [
        ...prev,
        { id: Date.now(), message: { title: 'Erro!', description: 'Ocorreu um erro ao tentar salvar o webhook.' }, isLoading: false },
      ]);
    }
  };

  const { register, handleSubmit, formState: { errors, isSubmitting } } = webhookForm;

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary" size="sm">
            <Plus className="mr-2 size-3" />
            Adicionar webhook
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ouvir eventos de upload</DialogTitle>
            <DialogDescription>
              Configure seu endpoint de webhook para receber eventos em tempo real.
            </DialogDescription>
          </DialogHeader>
          <FormProvider {...webhookForm}>
            <form onSubmit={handleSubmit(handleSaveWebhook)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" placeholder="Nome do Webhook" {...register('name')} />
                {errors.name && <p className="text-sm font-medium text-red-500 dark:text-red-400">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">URL do endpoint</Label>
                <Input id="url" placeholder="https://" {...register('url')} />
                {errors.url && <p className="text-sm font-medium text-red-500 dark:text-red-400">{errors.url.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="channels">Canais</Label>
                <select id="channels" {...register('channels')} className="w-full p-2 border border-gray-300 rounded-md">
                  <option value="">Selecione os canais</option>
                  <option value="email">E-mail</option>
                  <option value="app">Aplicativo</option>
                  <option value="bot">whatsapp-bot</option>
                </select>
                {errors.channels && <p className="text-sm font-medium text-red-500 dark:text-red-400">{errors.channels.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventType">Tipo de evento</Label>
                <select id="eventType" {...register('eventType')} className="w-full p-2 border border-gray-300 rounded-md">
                  <option value="">Selecione o evento</option>
                  <option value="upload">upload</option>
                  <option value="message">mensagens</option>
                </select>
                {errors.eventType && <p className="text-sm font-medium text-red-500 dark:text-red-400">{errors.eventType.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex gap-4">
                  <label>
                    <input type="radio" value="true" {...register('status')} />
                    Ativo
                  </label>
                  <label>
                    <input type="radio" value="false" {...register('status')} />
                    Inativo
                  </label>
                </div>
                {errors.status && <p className="text-sm font-medium text-red-500 dark:text-red-400">{errors.status.message}</p>}
              </div>

              <DialogFooter className="sm:justify-start">
                <div className="flex items-center justify-end gap-2">
                  <DialogClose asChild>
                    <Button variant="ghost">Cancelar</Button>
                  </DialogClose>
                  <Button disabled={mutation.isPending} className="w-20">
                    {mutation.isPending ? <Loader2 className="animate-spin" /> : 'Salvar'}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>

      <AlertDemo alerts={alerts} />
    </>
  );
};

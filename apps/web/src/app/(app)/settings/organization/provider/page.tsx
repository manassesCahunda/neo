'use client';

import { useState } from 'react';

import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { conviteLink } from './actions';

export   function DialogDemo({
  companyId,
  companyName,
  userProvider
}: {
  companyId: string;
  companyName: string;
  userProvider:string;
}) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setSuccess(false);
    setError(false);
    setLoading(true);

    try {

      const result = await conviteLink({userProvider, email, companyId, companyName });

      console.log(result);

      if (result) {
        setSuccess(true);
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Convidar para Equipe</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Convidar Membro para a Organização</DialogTitle>
          <DialogDescription>
            Insira o e-mail da pessoa que você deseja convidar para a sua
            organização.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              E-mail
            </Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        {success && (
          <div className="text-green-500 text-sm mt-2">
            Convite enviado com sucesso!
          </div>
        )}
        {error && (
          <div className="text-red-500 text-sm mt-2">
            Ocorreu um erro ao enviar o convite.
          </div>
        )}
        <DialogFooter>
          <Button type="button" onClick={handleSubmit} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : 'Confirmar as alterações'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


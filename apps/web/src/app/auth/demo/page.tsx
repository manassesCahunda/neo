'use client';

import React, { useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { acessEmail } from '@/action/acess-email';

const SignWithPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | null }>({ text: '', type: null });
  const [email, setEmail] = useState("");

  const userProvider = 'manassesbinga@gmail.com';
  const companyId = "8ebe8afe-d78e-4eec-af59-d129242fe531";
  const companyName = 'Neo';

  const onSubmit = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setMessage({ text: 'Por favor, insira um email válido.', type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      const response = await acessEmail(email, companyId, companyName, userProvider);

      if (response.success === true) {
        setMessage({ text: 'Email enviado com sucesso!', type: 'success' });
      } else {
        setMessage({ text: response.message, type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Erro ao enviar o email. Tente novamente.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('grid gap-6')}>
      <div className="grid gap-2" style={{ width: 400 }}>
        <h1 className="text-2xl font-semibold tracking-tight">Acessar ao painel</h1>
        <Input
          id="email"
          name="email"
          placeholder="nome@exemplo.com"
          type="email"
          autoCapitalize="none"
          autoComplete="email"
          className="py-6"
          onChange={(e) => setEmail(e.target.value)}
          autoCorrect="off"
          disabled={isLoading}
        />
        <Button type="button" className="py-6" onClick={onSubmit} style={{ borderRadius: '2px' }} disabled={isLoading}>
          {isLoading && <Loader2 className="size-4 animate-spin" />}
          Entrar com convite
        </Button>
        {message.text && (
          <p className={message.type === 'error' ? 'text-red-500' : 'text-green-500'} aria-live="polite">
            {message.text}
          </p>
        )}
      </div>
      {isLoading && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-50 bg-black z-10">
          <div className="animate-spin rounded-full border-t-2 border-b-2 border-white w-12 h-12"></div>
        </div>
      )}
    </div>
  );
};

export default SignWithPassword;

'use client';

import React, { useState } from 'react';

import { Loader2 } from 'lucide-react';
import Link from 'next/link';

import { acessEmail } from '@/action/acess-email';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const SignWithPassword = ({ className, ...props }: UserAuthFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | null }>({ text: '', type: null });

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: null });

    const emailInput = (event.target as HTMLFormElement).elements.namedItem("email") as HTMLInputElement;
    const email = emailInput.value;

    const response = await acessEmail(email); 

    setIsLoading(false);
    if (response.success) {
      setMessage({ text: 'Email acessado com sucesso!', type: 'success' });
    } else {
      setMessage({ text: response.message, type: 'error' });
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}> 
        <div className="grid gap-2" style={{ width: 400 }}>
          <h1 className="text-2xl font-semibold tracking-tight">Acessar ao painel</h1>
          <br />
          <div className="grid gap-1">
            <Input
              id="email"
              name="email" 
              placeholder="nome@exemplo.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              className="py-6"
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>
          <br />
          <Button className="py-6" style={{ borderRadius: '2px' }} disabled={isLoading}>
            {isLoading &&  <Loader2 className="size-4 animate-spin" />}
            Entrar com Email
          </Button>
          {message.text && (
            <p className={message.type === 'error' ? 'text-red-500' : 'text-green-500'}>
              {message.text}
            </p>
          )}
          <div className="flex space-x-3 mt-4 justify-center">
            <Link href="/auth" passHref>
              <Button variant="outline" className="w-[200px] py-6" style={{ borderRadius: '2px' }} disabled={isLoading}>
                {isLoading &&  <Loader2 className="size-4 animate-spin" />}
                Acessar com senha
              </Button>
            </Link>
            <Link href="/auth/signup" passHref>
              <Button className="w-[200px] py-6" style={{ borderRadius: '2px' }} disabled={isLoading}>
                {isLoading &&  <Loader2 className="size-4 animate-spin" />}
                Cadastrar usuário
              </Button>
            </Link>
          </div>
        </div>
      </form>
      {isLoading && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-50 bg-black z-10">
          <div className="animate-spin rounded-full border-t-2 border-b-2 border-white w-12 h-12"></div>
        </div>
      )}
    </div>
  );
}

export default SignWithPassword;

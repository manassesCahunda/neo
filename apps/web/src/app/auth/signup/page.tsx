'use client'

'use client';

import { useEffect, useState } from 'react';
import { AlertCircleIcon, AlertTriangle, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { signUpAction } from '@/action/create-account';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFormState } from '@/hooks/use-form-state';

const LoaderComponent = dynamic(() => import('lucide-react').then((mod) => mod.Loader2), {
  loading: () => <Loader2 className="animate-spin" size={20} />,
  ssr: false,
});

const Signup = () => {

  const [{ errors, message, success }, handleSubmit, isPending] = useFormState(
    signUpAction,
    ()=>{}
  );

  return (
    <div className="bg-[var(--background)] flex flex-col text-center p-4 gap-4 relative">
      <form onSubmit={handleSubmit} className="space-y-4">
        {success === false && message && (
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertTitle>Falha ao cadastrar!</AlertTitle>
            <AlertDescription>
              <p>{message}</p>
            </AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert variant="default">
            <AlertCircleIcon className="size-4" />
            <AlertTitle>Cadastrado com sucesso! Um link de acesso foi enviado ao seu email.</AlertTitle>
            <AlertDescription>
              <p>{message}</p>
            </AlertDescription>
          </Alert>
        )}
        <div className="space-y-2">
          <Input
            name="name"
            id="name"
            placeholder="Nome de usuário"
            className="h-11 py-6"
            disabled={isPending}
          />
          {errors?.name && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.name[0]}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Input
            name="email"
            placeholder="Email"
            type="email"
            id="email"
            className="h-11 bg-[var(--input)] py-6"
            disabled={isPending}
          />
          {errors?.email && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.email[0]}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Input
            name="password"
            placeholder="Senha"
            type="password"
            id="password"
            className="h-11 bg-[var(--input)] py-6"
            disabled={isPending}
          />
          {errors?.password && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.password[0]}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Input
            name="password_confirmation"
            type="password"
            placeholder="Confirmar Senha"
            id="password_confirmation"
            className="h-11 bg-[var(--input)] py-6"
            disabled={isPending}
          />
          {errors?.password_confirmation && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.password_confirmation[0]}
            </p>
          )}
        </div>
        <div className="flex flex-col space-y-2">
          <Button className="bg-white border text-black py-6" disabled={isPending}>
            {isPending ? (
              <LoaderComponent />
            ) : (
              'Cadastrar Conta'
            )}
          </Button>
          <div className="flex space-x-3 mt-4 justify-center">
            <Link href="/auth/email" passHref>
              <Button variant="outline" className="w-[200px] py-6" style={{ borderRadius: '2px' }} disabled={isPending}>
                {isPending && <LoaderComponent />}
                Acessar com email
              </Button>
            </Link>
            <Link href="/auth" passHref>
              <Button className="w-[200px] py-6" style={{ borderRadius: '2px' }} disabled={isPending}>
                {isPending && <LoaderComponent />}
                Acessar com senha
              </Button>
            </Link>
          </div>
          <div className="text-left mt-4">
            <span>É necessário um domínio empresarial para acessar os serviços.</span>
            <br />
            <Link href="/auth/company" className="underline text-blue-500" passHref>
              Registrar domínio
            </Link>
          </div>
        </div>
      </form>
      {isPending && !message && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-50 bg-black z-10">
          <div className="animate-spin rounded-full border-t-2 border-b-2 border-white w-12 h-12"></div>
        </div>
      )}
    </div>
  );
};

export default Signup;

'use client';

import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  usePathname,
  useRouter,
} from 'next/navigation';

import { acessAccount } from '@/action/acess-account';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const Loading = dynamic(() => import('lucide-react').then((mod) => mod.Loader2), {
  loading: () => <Loader2 className="size-4 animate-spin" size={20} />,
  ssr: false,
});


const SignIn = ({ className }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/inbox') {
      setIsLoading(false);
    }
  }, [pathname]);

  const onSubmit = useCallback(async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const email = (event.target as HTMLFormElement).email.value;
    const password = (event.target as HTMLFormElement).password.value;

    if (!email || !password) {
      setIsLoading(false);
      setError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      const response = await acessAccount(email, password);

      if (response.success) {
        setSuccess('Login bem-sucedido! Redirecionando...');
        router.push('/inbox');
      } else {
        setError(response.message || 'Falha no login.');
        setIsLoading(false);
      }
    } catch (error) {
      setError('Ocorreu um erro inesperado.');
      setIsLoading(false);
    }
  }, [router]);



  const handleLinkClick = (url:string) => {
    setIsLoading(true);
    if (pathname === url) {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('grid gap-6', className)}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2" style={{ width: 400 }}>
          <h1 className="text-2xl font-semibold tracking-tight">Acessar ao painel</h1>
          <br />
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}

          <div className="grid gap-1">
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <Input
              id="email"
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

          <div className="grid gap-2">
            <label htmlFor="password" className="sr-only">
              Senha
            </label>
            <Input
              id="password"
              placeholder="senha"
              type="password"
              autoCapitalize="none"
              autoComplete="current-password"
              autoCorrect="off"
              className="py-6"
              disabled={isLoading}
            />
          </div>
          <br />

          <Button
            className="py-6 flex items-center justify-center"
            style={{ borderRadius: '4px' }}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="animate-spin mr-2" size={20} />}
            {isLoading ? 'Carregando...' : 'Entrar com Email'}
          </Button>

          <div className="flex space-x-3 mt-4 justify-center">
            <Link href="/auth/signup" passHref>
              <Button variant="outline" className="w-[200px] py-6" style={{ borderRadius: '2px' }} disabled={isLoading}>
                {isLoading && <Loading />}
                Cadastrar usuário
              </Button>
            </Link>
            <Link href="/auth/email" passHref>
              <Button className="w-[200px] py-6" style={{ borderRadius: '2px' }} disabled={isLoading}>
                {isLoading && <Loading />}
                Acessar com email
              </Button>
            </Link>
          </div>

          <div style={{ textAlign: 'left' }}>
            <span>É necessário um domínio empresarial para acessar os serviços.</span>
            <br />
            <Link href="/auth/company" className="underline text-blue-500"  
             onClick={()=>handleLinkClick("/auth/company")}
             aria-label="Registrar domínio empresarial"
            >
              {isLoading ? (
                <Loader2 className="animate-spin mr-2" size={20} />
              ) : (
                'Registrar domínio'
              )}
            </Link>
            <br />
            <Link href="/auth/demo" className="underline text-blue-500" 
              onClick={()=>handleLinkClick("/auth/demo" )}
              aria-label="Acessar conta demo"
            >
              {isLoading ? (
                <Loader2 className="animate-spin mr-2" size={20} />
              ) : (
                'Conta demo'
              )}
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
};

export default SignIn;

'use client';


import { ReactNode, useMemo, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { trpcLinks } from '@/lib/trpc/client';
import { trpc, TRPCProvider } from '@/lib/trpc/react';
import { usePathname } from 'next/navigation';
import { StrictMode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { AlertDemo } from '@/components/toast';

function ErrorFallback({ error }: { error: Error }) {
   const [alerts, setAlerts] = useState<{ id: number; message: { description: string; title: string }; isLoading?: boolean }[]>([]);
 
   useEffect(() => {
    setAlerts((prev) => [
        ...prev,
        { id: Date.now(), message: { title:'Tente recarregar a página.', description: `Algo deu errado: ${error.message}` }, isLoading: false },
      ]);
   }, [error]);

   return (
     <>
      <AlertDemo alerts={alerts} />
     </>
   )

}

export function Providers({ children }: { children: ReactNode }) {
    const queryClient = useMemo(() => new QueryClient(), []);
    const trpcClient = useMemo(() => trpc.createClient({ links: trpcLinks }), []);
    const pathname = usePathname();

    const memoizedChildren = useMemo(() => children, [children]);


    useEffect(() => {
        if (pathname) {
            console.log('Current URL:', pathname);
            try {
                document.cookie = `currentUrl=${pathname}; max-age=${60 * 60 * 24 * 7}; path=/`;
            } catch (error) {
                console.error('Erro ao definir cookie:', error);
            }
        }
    }, [pathname]);


    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem={true}
                enableColorScheme={true}
            >
                <TRPCProvider client={trpcClient} queryClient={queryClient}>
                    <QueryClientProvider client={queryClient}>
                        <StrictMode>
                                {memoizedChildren}
                        </StrictMode>
                    </QueryClientProvider>
                </TRPCProvider>
            </ThemeProvider>
        </ErrorBoundary>
    );
}

'use client';

import React, {
  Suspense,
  useEffect,
  useState,
} from 'react';

import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import dark from '@/assets/icone/dark.svg';
import { Nav } from '@/components/nav';
import { Sidebar } from '@/components/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AuthProvider,
  useAuth,
} from '@/context/useAuthProvider';


const Loading = dynamic(() => import('lucide-react').then((mod) => mod.Loader2), {
  loading: () => <Loader2 className="size-4 animate-spin" size={20} />,
  ssr: false,
});

const SidebarWithLazyLoading = dynamic(() => import('@/components/sidebar/index').then((mod) => mod.Sidebar), {
  loading: () => <Sidebar isCollapsed={true} />,
  ssr: false,
});

const NavWithLazyLoading = dynamic(() => import('@/components/nav').then((mod) => mod.Nav), {
  loading: () => <Nav />,
  ssr: false,
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AuthProvider>
      <ProtectedContent>{children}</ProtectedContent>
    </AuthProvider>
  );
}

function ProtectedContent({ children }: { children: React.ReactNode }) {
  const { isAuthorized, loading, error } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useRouter();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (!isAuthorized && !loading) {
      timeoutId = setTimeout(() => {
        setIsLoading(false);
        document.cookie = `sessionId=; max-age=-1; path=/`;
        document.cookie = `token=; max-age=-1; path=/`;
        document.cookie = `refreshToken=; max-age=-1; path=/`;
        navigation.push('/auth');
      }, 2000); 

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [isAuthorized, loading, navigation]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!isAuthorized) {
    return <div>Acesso negado.</div>;
  }

  return (
    <div className="flex h-full">
      <div className="flex flex-col items-center mr-5">
        <div className="mt-5">
          <Image alt="logo" src={dark} width={50} height={50} />
        </div>

        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center">
            <Skeleton className="h-full w-[100px]" />
          </div>
        }>
          <SidebarWithLazyLoading isCollapsed={true} />
        </Suspense>
      </div>

      <div className="flex-1 flex flex-col">
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center">
            <Skeleton className="h-full w-full" />
          </div>
        }>
          <NavWithLazyLoading />
        </Suspense>

        <main
          className="flex-1"
          style={{
            width: "100%",
            height: "auto",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

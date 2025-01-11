'use client';

import React, { Suspense } from 'react';

import {
  Building,
  User2,
} from 'lucide-react';
import dynamic from 'next/dynamic';

const AsideLink = dynamic(() => import('./aside-link'), { suspense: true });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-5 gap-12">
      <aside className="-mx-4 space-y-8">
        <Suspense fallback={<div>Carregando menu...</div>}>
          <nav className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <span className="mb-10 mt-10 px-4 text-xs font-semibold uppercase text-muted-foreground">
                Geral
              </span>
              <AsideLink href="/settings/profile">
                <User2 className="mr-2 size-4" />
                Perfil
              </AsideLink>
              <AsideLink href="/settings/organization">
                <Building className="mr-2 size-4" />
                Organização
              </AsideLink>
            </div>
          </nav>
        </Suspense>
      </aside>
      <div className="col-span-4 overflow-y-auto max-h-screen pb-10">
        {children}
      </div>
    </div>
  );
}

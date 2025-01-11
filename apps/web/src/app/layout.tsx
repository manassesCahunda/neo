import type { Metadata } from "next";
import "@/styles/globals.css";
import dynamic from "next/dynamic";
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';  

const Providers = dynamic(() => import('./Provider').then((mod) => mod.Providers), {
  loading: () => <Loader2 className="size-4 animate-spin" size={20} /> 
});

export const metadata: Metadata = {
  title: "neo",
  description: "projecto privado",
  icons: {
    icon: "/favicon/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning={true}>
      <body>
        <Suspense fallback={<Loader2 className="size-4 animate-spin" size={20} />}>
          <Providers>
            {children}
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}

'use client';

import Image from 'next/image';
import { TypeAnimation } from 'react-type-animation';
import dynamic from 'next/dynamic';
import logo from '@/assets/icone/logo.svg';

const Spline3D = dynamic(() => import('@/components/spline'), { ssr: false });

export default function AuthenticationPage({ children }: { children: React.ReactNode; }) {
  return (
    <div className="container relative flex h-full flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col p-10 text-white bg-black lg:flex">
        <div style={{ width: "100%", height: 600 }} className='flex items-center justify-center relative'>
            <Spline3D />
          <div className="absolute top-0 left-0 z-20 flex items-center text-xl font-medium">
            <Image alt='logo' src={logo} width={120} height={100}  />
          </div>
          <div  style={{
              fontFamily: "Teko, sans-serif",
              fontOpticalSizing: "auto", 
              fontWeight: 300,
              fontStyle: "normal"
          }} className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 text-4xl font-bold text-white">
          <TypeAnimation 
              sequence={[
                'Bem-vindo à sua plataforma de gestão de negócios inteligentes!',
                2000,
                'Welcome to your intelligent business management platform!',
                2000,
                '¡Bienvenido a su plataforma de gestión empresarial inteligente!',
                2000,
                'Bienvenue sur votre plateforme de gestion d\'entreprise intelligente!',
                2000,
                'Добро пожаловать на вашу платформу управления умным бизнесом!',
                2000,
                'インテリジェントなビジネス管理プラットフォームへようこそ！',
                2000
              ]}
              speed={50}
              wrapper="div"
              cursor={true}
              repeat={Infinity}
            />
          </div>
        </div>
      </div>
      <div className="w-full h-full flex flex-col justify-center items-center space-y-6">
        <div className="text-center">
          {children}
        </div>
      </div>
    </div>
  );
}

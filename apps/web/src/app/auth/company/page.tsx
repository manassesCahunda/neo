'use client';

import React, {
  useEffect,
  useState,
} from 'react';

import { serialize } from 'cookie';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import {
  usePathname,
  useRouter,
} from 'next/navigation';

import {
  sendOtpRequest,
  verifyOtpRequest,
} from '@/action/create-company';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const Spinner = dynamic(() => import('lucide-react').then((mod) => mod.Loader2), {
  loading: () => <Loader2 className="size-4 animate-spin" size={20} />,
  ssr: false,
});

const OtpForm: React.FC<any> = ({ className, ...props }) => {
  const router = useRouter();
  const  pathname  = usePathname();
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpId, setOtpId] = useState('');
  const [otpValid, setOtpValid] = useState(false);
  const [errors, setErrors] = useState({ email: '', otp: '' });
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  
  useEffect(() => {
    if (pathname === '/auth/signup') {
      setIsLoading(false);
    }
  }, [pathname]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (e.target.value.trim() !== '') {
      setErrors((prev) => ({ ...prev, email: '' }));
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
    if (e.target.value.trim() !== '') {
      setErrors((prev) => ({ ...prev, otp: '' }));
    }
  };

  const validateForm = () => {
    let valid = true;
    if (email.trim() === '') {
      setErrors((prev) => ({ ...prev, email: 'Por favor, insira um e-mail válido.' }));
      valid = false;
    }
    if (otpSent && otp.trim() === '') {
      setErrors((prev) => ({ ...prev, otp: 'Por favor, insira o código OTP.' }));
      valid = false;
    }
    return valid;
  };

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await sendOtpRequest({ email });
      if (response) {
        setOtpSent(true);
        setOtpId(response.otpId);
      } else {
        setErrors((prev) => ({ ...prev, email: 'Erro ao enviar o OTP. Tente novamente.' }));
      }
    } catch (error) {
      setErrors((prev) => ({ ...prev, email: 'Erro ao enviar o OTP. Tente novamente.' }));
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await verifyOtpRequest({ email, otp, otpId });
      if (result) {
        document.cookie = serialize('companyId', result, {
          path: '/',
          maxAge: 60 * 5, 
        });
        setOtpValid(true);
        router.push('/auth/signup');
      } else {
        setErrors((prev) => ({ ...prev, otp: 'OTP inválido. Tente novamente.' }));
      }
    } catch (error) {
      setErrors((prev) => ({ ...prev, otp: 'Erro ao verificar o OTP. Tente novamente.' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={otpSent ? verifyOtp : sendOtp}>
        <div className="grid gap-2" style={{ width: 400 }}>
          <h1 className="text-2xl font-semibold tracking-tight">Registrar domínio comercial</h1>
          <br />
          <div className="grid gap-1">
            <Input
              id="email"
              type="email"
              placeholder="Insira o e-mail do seu domínio comercial"
              value={email}
              className="py-6"
              onChange={handleEmailChange}
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}

            {otpSent && (
              <>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Digite o código OTP"
                  value={otp}
                  className="py-6"
                  onChange={handleOtpChange}
                />
                {errors.otp && <p className="text-red-500">{errors.otp}</p>}
              </>
            )}
          </div>
          <br />
          <Button
            className="py-6"
            style={{ borderRadius: '2px' }}
            type="submit"
            disabled={loading || (otpSent && !otp)}
          >
            {loading ? (
              <>
                <Spinner />
                Carregando...
              </>
            ) : (
              otpSent ? 'Verificar Código OTP' : 'Enviar Código OTP'
            )}
          </Button>
          {otpValid && (
            <>
              <p className="text-green-500" aria-live="polite">OTP validado com sucesso!</p>
              <br />
              <p className="text-green-500" aria-live="polite">Aguardando redirecionamento...</p>
            </>
          )}
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

export default OtpForm;

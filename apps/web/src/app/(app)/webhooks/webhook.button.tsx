'use client'

import {
  useEffect,
  useState,
} from 'react';

import {
  Code2,
  Loader2,
} from 'lucide-react';
import {
  usePathname,
  useRouter,
} from 'next/navigation';

import { Button } from '@/components/ui/button';

export default function WebhooksButton() {
  const [loading, setLoading] = useState(false); 
  const router = useRouter();
  const pathname = usePathname();

  const handleButtonClick = () => {
    setLoading(true);
    if (pathname === "/webhooks/logs") {
      setLoading(false);
    }
    setTimeout(() => {
      router.push('/webhooks/logs');
    }, 500); 
  };


  useEffect(() => {
    if (pathname === "/webhooks/logs") {
      setLoading(false);
    }
  }, [pathname]);
  return (
    <>
        <div className="space-x-3">
          <Button
            size="default"
            variant="outline"
            onClick={handleButtonClick} 
            disabled={loading} 
          >
            {loading ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Code2 className="mr-2 size-4" />
            )}
            Logs dos webhooks
          </Button>
        </div>
          {loading && (
            <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-50 bg-black z-10">
              <div className="animate-spin rounded-full border-t-2 border-b-2 border-white w-12 h-12"></div>
            </div>
          )}
    </>
  );
}

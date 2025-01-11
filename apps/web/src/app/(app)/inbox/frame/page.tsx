'use client';

import {
  useEffect,
  useRef,
  useState,
} from 'react';

import { useSearchParams } from 'next/navigation';

import { getUrl } from '@/action/getLink';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type FileData = {
  name: string;
  date: string;
  value: string; 
  src: string;
  downloadUrl?: string;
};

interface FilePreviewProps {
  files: {
    id: string; 
    companyName: string;
    createdAt: string;
    balanceTotal: string;
    details: string;
  }[] | undefined;
}

export default function FilePreview({ files = [] }: FilePreviewProps) {
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [isLoaded, setLoaded] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const search = useSearchParams();
  const idFile = search.get('file') || '';
  const selectedFile = files.find(file => file.id === idFile); 

  const defaultFileData: FileData = {
    name: 'Exemplo de Empresa',
    date: new Date().toISOString(),
    value: '1000.00', 
    src: 'https://example.com/sample.pdf', 
    downloadUrl: 'https://example.com/sample-download.pdf',
  };

  const fetchUrl = async (bucket: string, fileId: string) => {
    try {
      const src = await getUrl(bucket, fileId); 
      setFileData({
        name: selectedFile!.companyName,
        date: selectedFile!.createdAt,
        value: selectedFile!.balanceTotal,
        src: src.signedUrl,
        downloadUrl: selectedFile!.id,
      });
      setIsDialogOpen(true);
    } catch (error) {
      console.error('Error fetching URL:', error);
      setErrorMessage('Failed to load the file. Please try again later.');
    }
  };

  useEffect(() => {
    if (selectedFile) {
      const bucket = selectedFile.details.split("@")[1]?.split(".")[0] || '';
      if (bucket) {
        fetchUrl(bucket, selectedFile.idFile);
      } else {
        console.error('Bucket not found in file details string.');
      }
    } else {
      setFileData(defaultFileData);
      setIsDialogOpen(true);
    }
  }, [selectedFile]);

  const handleLoaded = () => {
    setLoaded(true);
  };

  useEffect(() => {
    document.body.style.overflow = isDialogOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isDialogOpen]);

  if (!fileData && !isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <Skeleton className="w-full h-full" />
        <p className="mt-4 text-sm font-medium">Carregando ficheiro...</p>
      </div>
    );
  }
  

  function parseCurrency(currencyString) {
    const numberString = currencyString.replace(/\./g, '').replace(',', '.');
    return parseFloat(numberString);
  }
  

  const formattedValue = (() => {
    const value = parseCurrency(fileData?.value || '0'); 
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
    }).format(value); 
  })();

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <div className="relative h-full border overflow-hidden mr-10" style={{ minHeight: '500px', minWidth: '500px' }}>
        <div className="absolute top-0 left-0 right-0 p-2 bg-white dark:bg-black z-10 flex justify-between items-center">
          <div>
            <h3 className="font-semibold pl-0 p-2">{fileData?.name}</h3>
            <p className="text-sm">{formattedValue} - {new Date(fileData?.date).toLocaleDateString()}</p>
          </div>
          <div className="flex space-x-2">
            {fileData?.downloadUrl && (
              <a href={fileData.downloadUrl} download>
                <Button variant="secondary">Download</Button>
              </a>
            )}
          </div>
        </div>
        {errorMessage && <div className="absolute top-0 left-0 right-0 bg-red-500 text-white p-2">{errorMessage}</div>}
        <div className={cn("w-full h-full flex justify-center bg-[#F2F1EF] dark:bg-black mt-20", isLoaded ? "" : "flex items-center justify-center")}>
          {!isLoaded && <Skeleton className="w-full h-full" />}
          <iframe
            ref={iframeRef}
            title="Preview"
            src={`${fileData?.src}#toolbar=0&scrollbar=0`}
            width="100%"
            height="100%"
            loading="lazy"
            allowFullScreen
            className="h-full w-full duration-100"
            style={{ border: 'none', padding: 0, minHeight: '500px', minWidth: '500px' }}
            onLoad={handleLoaded}
          />
        </div>
      </div>
    </Dialog>
  );
}

'use client';

import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useDropzone } from 'react-dropzone';
import {
  FaCheckCircle,
  FaTimesCircle,
} from 'react-icons/fa';

import { handleDrop } from '@/action/handle-drop';
import { AllTransactions } from '@/action/queryAllTransactions';
import { AlertDemo } from '@/components/toast';
import { formatData } from '@/hooks/useFormDate';
import { useQuery } from '@tanstack/react-query';
import { Suspense } from "react";


const Folders = dynamic(() => import('./explore/page'), { suspense: true });
const FilePreview = dynamic(() => import('./frame/page'), { suspense: true });
const TaskPage = dynamic(() => import('./task/page'), { suspense: true });

const Loading = dynamic(() => import('lucide-react').then((mod) => mod.Loader2), {
  loading: () => <Loader2 className="size-4 animate-spin" size={10} />,
  ssr: false,
});

const Inbox = () => {
  const [alerts, setAlerts] = useState<{ id: number; message: { description: string; title: string }; isLoading?: boolean }[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ file: string; progress: number }[]>([]);
  const [uploadStatus, setUploadStatus] = useState<{ file: string; status: 'success' | 'error' | 'in-progress' }[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<Set<string>>(new Set()); 

  const uploadContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (uploadContainerRef.current) {
      uploadContainerRef.current.scrollTop = uploadContainerRef.current.scrollHeight;
    }
  }, [uploadProgress, uploadStatus]);

  const { data, error, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => {
      return AllTransactions().then((response) => response.data);
    },
  });


  const onDropAccepted = async (acceptedFiles: File[]) => {
    const loadingAlertId = Date.now();

    const newFiles = acceptedFiles.filter((file) => !uploadedFiles.has(file.name));

    if (newFiles.length === 0) {
      setAlerts((prev) => [
        ...prev,
        { id: Date.now(), message: { title: 'Arquivo Duplicado', description: 'Este arquivo já foi carregado anteriormente.' } },
      ]);
      return; 
    }

    const newStatus = newFiles.map((file) => ({
      file: file.name,
      status: 'in-progress',
    }));

    setUploadStatus(newStatus);

    try {
      await Promise.all(
        newFiles.map((file, index) =>
          handleDrop(file, (progress) => {
            setUploadProgress((prev) => {
              const updated = [...prev];
              updated[index] = { file: file.name, progress };
              return updated;
            });
          }).then((response) => {
            if (response.success) {
              setUploadedFiles((prev) => new Set(prev.add(file.name)));
              setUploadStatus((prev) =>
                prev.map((status) => (status.file === file.name ? { ...status, status: 'success' } : status))
              );
              setAlerts((prev) => [
                ...prev,
                { id: Date.now(), message: { title: 'Upload Bem-Sucedido', description: `Arquivo "${file.name}" enviado com sucesso.` } },
              ]);
            } else {
              setUploadStatus((prev) =>
                prev.map((status) => (status.status === 'in-progress' ? { ...status, status: 'error' } : status))
              );
              setAlerts((prev) => [
                ...prev,
                { id: Date.now(), message: { title: 'Upload Falhou', description: 'Ocorreu um erro durante o upload.' }, isLoading: false },
              ]);
            }
          })
        )
      );
    } catch (error) {
      console.error('Upload falhou:', error);
      setUploadStatus((prev) =>
        prev.map((status) => (status.status === 'in-progress' ? { ...status, status: 'error' } : status))
      );
      setAlerts((prev) => [
        ...prev,
        { id: Date.now(), message: { title: 'Upload Falhou', description: 'Ocorreu um erro durante o upload.' }, isLoading: false },
      ]);
    }
  };

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDropAccepted,
    multiple: true,
  });

  const onScreenClick = (event: React.MouseEvent) => {
    if ((event.target as HTMLElement).closest('.upload-progress') === null) {
      if (acceptedFiles.length > 0) {
        onDropAccepted(acceptedFiles);
      }
    }
  };

  const onDragOver = async (event: React.DragEvent) => {
    event.preventDefault();
    if (acceptedFiles.length > 0) {
      await onDropAccepted(acceptedFiles);
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Erro: {error instanceof Error ? error.message : 'Erro desconhecido ocorreu'}</div>;
  }

  const formattedData = Array.isArray(data) ? formatData(data) : formatData([data]);

  return (
    <>
      <br />
      {uploadProgress.length === 0 ? (
        <p>{isDragActive ? 'Enviando arquivos...' : 'Arraste e solte arquivos ou clique para selecionar'}</p>
      ) : (
        ''
      )}
      {uploadProgress.length > 0 && (
        <div className="upload-progress">
          <div ref={uploadContainerRef} className="space-y-2 h-6 overflow-y-auto p-1">
            <ul>
              {uploadProgress.map(({ file, progress }) => (
                <li key={file} className="flex items-center">
                  {file.toLowerCase()}: {progress}%
                  <Loading />
                </li>
              ))}
            </ul>
            <ul>
              {uploadStatus.map(({ file, status }) => (
                <li key={file} className="flex items-center">
                  {file.toLowerCase()}:
                  {status === 'success' ? (
                    <span className="flex items-center text-green-500">
                      <FaCheckCircle className="mr-1 ml-4" /> sucesso!
                    </span>
                  ) : status === 'error' ? (
                    <span className="flex items-center text-red-500">
                      <FaTimesCircle className="mr-1 ml-4" /> falhou
                    </span>
                  ) : (
                    <span className="ml-4"> enviado... </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <br />
      <div style={{ display: 'flex' }} {...getRootProps()} onDragOver={onDragOver} onClick={onScreenClick}>
        <input {...getInputProps()} />
        <br />
        <div style={{ flex: 1 }}>
          <Suspense fallback={<div>Carregando pastas...</div>}>
            <Folders invoiceData={formattedData} />
          </Suspense>
          <Suspense fallback={<div>Carregando tarefas...</div>}>
            <TaskPage data={formattedData} />
          </Suspense>
        </div>
        <div style={{ flex: 1, paddingLeft: '40px', maxWidth: '800px' }}>
          <Suspense fallback={<div>Carregando arquivos...</div>}>
            <FilePreview files={formattedData} />
          </Suspense>
        </div>
        <AlertDemo alerts={alerts} />
      </div>
    </>
  );
};

export default Inbox;

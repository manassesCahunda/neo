'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { FileTextIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
  const router = useRouter();

  const handleButtonClick = () => {
    const params = new URLSearchParams({
      file: row.original.id,
    });

    router.push(`${window.location.pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Button
      variant="ghost"
      className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
      onClick={handleButtonClick}
    >
      <FileTextIcon className="h-4 w-4" />
      <span className="sr-only">Visualizar</span>
    </Button>
  );
}

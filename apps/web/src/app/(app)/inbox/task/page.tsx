'use client';

import { columns } from "./columns";
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

const DataTable = dynamic(() => import('./date/data-table').then((mod) => mod.default), {
  loading: () => <Loader2 className="size-4 animate-spin" size={10} />,
});


export default function TaskPage({ data }: { data: any[] }) {
  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 pt-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <p className="text-muted-foreground">
              Esta é a sua Lista de Faturas e comprovativos deste mês!
            </p>
          </div>
        </div>
        <DataTable data={data} columns={columns} />
      </div>
    </>
  );
}

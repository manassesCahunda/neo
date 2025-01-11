import { DataTableRowActions } from '@/app/(app)/inbox/task/date/row-actions';
// import { Invoice } from '@/hooks/schema';
import { ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from './header';

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "companyName",
    header: ({ column }) => <span className="-ml-3 h-8 data-[state=open]:bg-accent">Nome da Empresa</span>,
    cell: ({ row }) => <span>{row.getValue("companyName")}</span>,
  },
  {
    accessorKey: "typeInvoice",
    header: () => <span className="-ml-3 h-8 data-[state=open]:bg-accent">Tipo de Fatura</span>,
    cell: ({ row }) => <span>{row.getValue("typeInvoice")}</span>,
  },
  {
    accessorKey: "unitPrice",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Preço Unitário" />,
    cell: ({ row }) => <span>{row.getValue("unitPrice")}</span>, 
  },
  {
    accessorKey: "totalIva",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Total de IVA" />,
    cell: ({ row }) => <span>{row.getValue("totalIva")}</span>,
  },
  {
    accessorKey: "balanceTotal",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Saldo Total" />,
    cell: ({ row }) => <span>{row.getValue("balanceTotal")}</span>,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Criado Em" />,
    cell: ({ row }) => <span>{new Date(row.getValue("createdAt")).toLocaleString()}</span>, 
  },
  {
    accessorKey: "details",
    header: () => <span className="-ml-3 h-8 data-[state=open]:bg-accent">Usuário</span>,
    cell: ({ row }) => <span>{row.getValue("details")}</span>,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];

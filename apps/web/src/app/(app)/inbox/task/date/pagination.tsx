'use client';

import { Button } from '@/components/ui/button';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
  const search = useSearchParams();
  const [pageIndex, setPageIndex] = useState(parseInt(search.get('page') || '0', 10));
  const [pageSize, setPageSize] = useState(parseInt(search.get('size') || '3', 10));

  useEffect(() => {
    const queryPageIndex = parseInt(search.get('page') || '0', 10);
    const queryPageSize = parseInt(search.get('size') || '3', 10);
    
    if (queryPageIndex !== pageIndex) {
      setPageIndex(queryPageIndex);
      table.setPageIndex(queryPageIndex);
    }

    if (queryPageSize !== pageSize) {
      setPageSize(queryPageSize);
      table.setPageSize(queryPageSize);
    }
  }, [search, pageIndex, pageSize]);

  const updateURL = (newPageIndex: number, newPageSize: number) => {
    // Atualiza a URL com os parâmetros de paginação
    const url = new URL(window.location.href);
    url.searchParams.set('page', newPageIndex.toString());
    url.searchParams.set('size', newPageSize.toString());
    window.history.pushState({}, '', url.toString());
  };

  const handlePageChange = (newPageIndex: number, newPageSize: number) => {
    if (newPageIndex !== pageIndex) {
      setPageIndex(newPageIndex);
      table.setPageIndex(newPageIndex);
      updateURL(newPageIndex, newPageSize);
    }

    if (newPageSize !== pageSize) {
      setPageSize(newPageSize);
      table.setPageSize(newPageSize);
      updateURL(newPageIndex, newPageSize);
    }
  };

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => handlePageChange(0, pageSize)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => handlePageChange(table.getState().pagination.pageIndex - 1, pageSize)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => handlePageChange(table.getState().pagination.pageIndex + 1, pageSize)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => handlePageChange(table.getPageCount() - 1, pageSize)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

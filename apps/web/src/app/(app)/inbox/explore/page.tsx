"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Icons } from '@/components/ui/icons';

type Item = {
  id: string;
  name: string;
  type: 'folder' | 'file';
  items?: Item[];
};

type Invoice = {
  id: string;
  companyName: string;
  entity: string;
  identify: string;
  details: string;
  dateInvoice: string;
  expiryDate: string;
  typeInvoice: string;
  unitPrice: string;
  amount: string;
  total: string;
  totalIva: any;
  balanceTotal: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  idFile: string;
};

type ExploreProps = {
  invoiceData: Invoice[];
};

function createCategoriesFromInvoices(invoices: Invoice[]): Item[] {
  const root: Item = { id: "root", name: "Invoices", type: 'folder', items: [] };

  invoices.forEach(invoice => {
    const pathParts = invoice.idFile.split('/');
    let currentFolder = root.items;

    pathParts.forEach((part, index) => {
      const existingFolder = currentFolder.find(item => item.name === part);
      
      if (existingFolder) {
        currentFolder = existingFolder.items!; // @ts-ignore
      } else {
        const newFolder: Item = {
          id: `${invoice.id}`,
          name: part,
          type: index === pathParts.length - 1 ? 'file' : 'folder',
          items: index === pathParts.length - 1 ? [] : [],
        };
        currentFolder.push(newFolder);
        currentFolder = newFolder.items!; // @ts-ignore
      }
    });
  });

  return root.items || [];
}

function findPathByName(name: string, items: Item[], path: Item[] = []): Item[] | null {
  for (const item of items) {
    if (item.name === name) return [...path, item];
    if (item.type === 'folder' && item.items) {
      const found = findPathByName(name, item.items, [...path, item]);
      if (found) return found;
    }
  }
  return null;
}

export default function Explore({ invoiceData }: ExploreProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathParam = searchParams.get('path') || '';
  const [path, setPath] = useState<Item[]>([]);
  const [notFound, setNotFound] = useState<boolean>(false);

  const categories = useMemo(() => createCategoriesFromInvoices(invoiceData), [invoiceData]);

  useEffect(() => {
    if (pathParam) {
      const pathParts = pathParam.split('/');
      const newPath = findPathByName(pathParts[pathParts.length - 1], categories);
      if (newPath) {
        setPath(newPath);
        setNotFound(false);
      } else {
        setPath([]);
        setNotFound(true);
      }
    } else {
      setPath([{ name: "Explorer", items: categories }]);
      setNotFound(false);
    }
  }, [pathParam, categories]);

  const handleItemClick = (item: Item) => {
    if (item.type === 'file') {
      console.log(item.id);
      const name = `${item.id}`;
      router.push(`${window.location.pathname}?file=${name}`, { scroll: false });
    } else {
      const newPath = [...path, item];
      const pathNames = newPath.map(item => item.name).join('/');
      router.push(`?path=${pathNames}`, { scroll: false });
      setPath(newPath);
    }
  };

  const handleBack = () => {
    setPath(prev => {
      const newPath = prev.slice(0, -1);
      const pathNames = newPath.map(item => item.name).join('/');
      router.push(`?path=${pathNames}`, { scroll: false });
      return newPath;
    });
  };

  const currentFolder = path[path.length - 1] || { name: "Explorer", items: categories };

  return (
    <div className="border w-full h-80 flex flex-col p-4">
      <div className="flex items-center justify-between mb-4">
        {path.length > 1 && (
          <button onClick={handleBack} className="text-blue-500 flex items-center" aria-label="Go back">
            <Icons.ArrowLeft size={20} className="mr-2" /> Back
          </button>
        )}
        <h2 className="text-lg font-semibold">{currentFolder.name}</h2>
      </div>
      {notFound ? (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-gray-500">File not found.</span>
        </div>
      ) : (
        <div className="flex flex-wrap">
          {currentFolder.items?.map((item) => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item)}
              className="cursor-pointer text-center flex flex-col items-center m-4"
            >
              {item.type === 'folder' ? (
                <Icons.Folder size={65} className="text-[#878787] dark:text-[#2C2C2C] mb-0" />
              ) : (
                <Icons.Files size={40} className="text-[#878787] dark:text-[#2C2C2C] mb-0" />
              )}
              <span className="text-sm truncate w-[70px]">{item.name}</span>
            </div>
          ))}
          {currentFolder.items?.length === 0 && (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-gray-500">No items found</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';

interface SheetDemoProps {
  body: string;
}

export function SheetDemo({ body }: SheetDemoProps) {
  const [textValue, setTextValue] = useState(body);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextValue(e.target.value);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">ver o conteudo</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Conteudo do Payload</SheetTitle>
        </SheetHeader>
        <div className="w-full h-4/5 pt-10">
          <Textarea
            className="w-full h-full" 
            onChange={handleChange}
            value={JSON.stringify(textValue, null, 2)} 
            disabled 
            placeholder={textValue}
            rows={6}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

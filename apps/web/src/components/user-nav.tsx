'use client';

import { useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUserData } from '@/hooks/userDate';
import { deleteSession } from "@/action/deleteSession";
import { AlertDemo } from './toast';
import {  useRouter } from "next/navigation";

export function UserNav() {
  const { user, isLoading, isError, error } = useUserData();
  const [alerts, setAlerts] = useState<any[]>([]);
  const router = useRouter();

  const onLogout = async () => {
    try {
      const Session = await deleteSession();
      setAlerts((prev) => [
        ...prev,
        { id: Date.now(), message: { title: 'Sessão finalizada', description: 'Você saiu com sucesso.' }, isLoading: false },
      ]);

      router.push("/inbox");

    } catch (err) {
      setAlerts((prev) => [
        ...prev,
        { id: Date.now(), message: { title: 'Erro ao finalizar sessão', description: 'Ocorreu um erro ao tentar finalizar a sessão.' }, isLoading: false },
      ]);
    }
  };

  function getInitials(name: string | undefined) {
    if (!name) return "";
    const nameParts = name.split(' ');
    const initials = nameParts.map(part => part.charAt(0).toUpperCase());
    return initials.join('');
  }

  if (isLoading) {
    return <p>Carregando...</p>;
  }

  if (isError) {
    return <p>Erro ao carregar os dados do usuário: {error instanceof Error ? error.message : 'Erro desconhecido'}</p>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.image || "/avatars/01.png"} alt={user?.email || "@shadcn"} />
            <AvatarFallback>{getInitials(user?.name) || "SC"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email || "m@example.com"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout}>
          Terminar Sessão
        </DropdownMenuItem>
      </DropdownMenuContent>
      <AlertDemo alerts={alerts} />
    </DropdownMenu>
  );
}

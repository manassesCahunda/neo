"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter
} from "@/components/ui/sheet";
import { FaRobot } from "react-icons/fa6";
import {
  app,
  doc,
  getFirestore,
  onSnapshot,
  setDoc,
} from '@neo/firebase';
import { useEffect, useState } from "react";

import { AlertDemo } from "@/components/toast";

const db = getFirestore(app);

interface SheetDemoProps {
  email: string;
}

export function SheetDemo({ email }: SheetDemoProps) {
  const [content, setContent] = useState<string>('');
  const [textura, setTextura] = useState<string>('');
  const [alerts, setAlerts] = useState<{
    id: number;
    message: { title: string; description: string };
    isLoading?: boolean;
  }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (email) {
      const docRef = doc(db, 'personAi', email);

      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const docData = docSnap.data();
          setContent(docData.content);
          setTextura(docData.content); 
        }
      });

      return () => unsubscribe();
    }
  }, [email]);

  const saveChanges = async () => {
    if (email) {
      setIsLoading(true);
      const docRef = doc(db, 'personAi', email);
      await setDoc(docRef, { content: textura }, { merge: true });
      setIsLoading(false);

      setAlerts(prev => [
        ...prev,
        { id: Date.now(), message: { title: 'Sucesso!', description: 'As alterações foram realizadas com sucesso.' }, isLoading: false },
      ]);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-15 h-15">
          <FaRobot style={{
            height: 40,
            width: 40
          }} />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edite as funções do assistente</SheetTitle>
          <SheetDescription>
            Ao alterar as funções e especificar como o assistente deve agir, o
            seu modo de atuação também será modificado.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            value={textura}
            onChange={(e) => setTextura(e.target.value)}
            placeholder={content || `
  bot estas são as informações necessárias:

  empresa:
    nome: Neo Tech Solutions
    membros e dados de contatos:
      374338494 - Marcos - assinaturas
      47449404 - Benagem - suporte técnico
      912345678 - Carla - marketing

  clientes importantes:
    contato: 91227123 - Marcos Diad - cliente premium
    contato: 48463626394 - Felia - cliente recorrente
    contato: 5566778899 - Ana Silva - parceria estratégica

  horários de atendimento:
    segunda a sexta: 08:00 - 18:00
    sábado: 09:00 - 14:00
    suporte emergencial: 24/7 (Benagem)

  tecnologias usadas:
    - React.js para front-end
    - Node.js para back-end
    - PostgreSQL para banco de dados
    - Docker para deploy

  funções que o bot deve realizar:
    - fornecer suporte técnico básico
    - encaminhar solicitações para o suporte avançado
    - organizar tarefas diárias dos membros da equipe
    - gerar relatórios de desempenho semanal
    - melhorar performance do sistema com sugestões
    - promover publicidade dos serviços da empresa

  alertas importantes:
    - identificar clientes premium e dar prioridade
    - reportar falhas críticas imediatamente
    - monitorar métricas de SLA (Service Level Agreement)
`}
          />
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="button" onClick={saveChanges} disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar alterações'}
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
      <AlertDemo alerts={alerts} />
    </Sheet>
  );
}

'use server';

import { z } from 'zod';
import { createServerAction } from 'zsa';

import {
  app,
  doc,
  getDoc,
  getFirestore,
  setDoc,
} from '@neo/firebase';
import { socket } from '@neo/socket/client';
import { generateMessage } from '@neo/trigger';
import { runs } from '@trigger.dev/sdk/v3';

const db = getFirestore(app);


let msg: string | undefined;
let msgGeral: string | undefined;


socket.on('connect', () => {
  console.log('Conexão cliente com o socket estabelecida.');
});

socket.on('message', (message: string) => {
  msg = message;
  console.log('Mensagem recebida no cliente:', message);
});

socket.on('response', (response: string) => {
  msgGeral = response;
  console.log('Resposta recebida  no cliente:', response);
});


async function waitForCompletion(triggerId: string, retries = 5, delay = 9000): Promise<any> {
  for (let attempt = 0; attempt < retries; attempt++) {
    const date = await runs.retrieve(triggerId);
    if (date.status === "COMPLETED") {
      return date;
    }
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  throw new Error('Tempo limite excedido aguardando a conclusão da tarefa.');
}

export const queryOpenai = createServerAction()
  .input(
    z.object({
      message: z.string().min(1, 'A mensagem não pode estar vazia'),
      phone: z.string().min(9, 'Número de telefone deve ter pelo menos 9 dígitos').optional(),
      email: z.string().email('Email inválido'),
      name: z.string().optional(),
    })
  )
  .handler(async ({ input }) => {
    
    const { message, phone, email, name } = input;

    console.log({ message, phone, email, name });

    try {
      
      const docRef = doc(db, 'personAi', email);
      const docSnap = await getDoc(docRef);

      let content = '';
      if (docSnap.exists()) {
        console.log('Documento já existe:', docSnap.data());
        content = docSnap.data().content;
      } else {
        await setDoc(docRef, { content: message });
        console.log('Novo documento criado com sucesso:', docRef.id);
      }
      
      const userNumber = phone ? `244${phone}@c.us` : 'sem numero';

      const triggerResponse = await generateMessage.trigger({
        content: content || 'Finja que você é assistente virtual de negócios chamado Dias, cuja função é ajudar.',
        message: message || "responde com os dados passados",
        domain: email,
        username: name || 'sem nome',
        userNumber,
        role: "Proprietario.",
      });

      console.log(triggerResponse);

      const date = await waitForCompletion(triggerResponse.id);

      const replyMessage = msg || msgGeral || 'Nenhuma resposta disponível no momento.';

      return replyMessage;

    } catch (error) {
      console.error('Erro ao processar a empresa:', error);
      return { success: false, message: `Ocorreu um erro: ${error.message}` };
    }
  });

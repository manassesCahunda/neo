import { AssemblyAI } from 'assemblyai';

import { env } from '@neo/env';
import {
  app,
  doc,
  getFirestore,
  onSnapshot,
} from '@neo/firebase';
import { socket } from '@neo/socket/client';
import { runs } from '@trigger.dev/sdk/v3';
import { generateMessage} from "@neo/trigger";


let msg: string | undefined;
let msgGeral: string | undefined;
let content: string | undefined;
let admin: string | undefined;


const db = getFirestore(app);

socket.on('connect', () => {
  console.log('Conexão com o socket estabelecida.');
});

socket.on('message', (message: string) => {
  msg = message;
  console.log('Mensagem recebida:', message);
});

socket.on('response', (response: string) => {
  msgGeral = response;
  console.log('Resposta recebida:', response);
});

async function waitForCompletion(triggerId: string, retries = 5, delay = 10000): Promise<any> {
  for (let attempt = 0; attempt < retries; attempt++) {
    const date = await runs.retrieve(triggerId);
    if (date.status === "COMPLETED") {
      return date;
    }
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  throw new Error('Tempo limite excedido aguardando a conclusão da tarefa.');
}

export function start(client: any, sessionName: string) {
  onSnapshot(doc(db, "personAi", sessionName), (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      content = data?.content;
      console.log("Documento atualizado:", data);
    } else {
      console.log("Documento não encontrado!");
    }
  });

  client.onMessage(async (message: any) => {
   if (message.type === "chat") {
      try {
        const triggerResponse = await generateMessage.trigger({
          content: content || 'Finja que você é um humano chamado Dias, cuja função é ajudar. Acabei de te enviar uma mensagem.',
          message: message.body,
          domain: sessionName,
          username: message?.sender?.id,
          userNumber: message?.sender?.name,
          role: (admin ===  message.sender.pushname ) ? "cliente" : "prorprietario"
        }).then(async (response) => {
          const date = await waitForCompletion(response.id);
          const replyMessage = msg || msgGeral || 'Nenhuma resposta disponível no momento.';
          console.log('Mensagem para enviar ao cliente:', date);
          await client.sendText(message.from, replyMessage);
        }).catch(async () => {
          await client.sendText(message.from, 'Desculpe, seu assistente Dias encontrou um erro ao processar sua resposta, mas o proprietário será notificado.');
        });
      } catch (error) {
        console.error('Erro ao executar a tarefa:', error);
        await client.sendText(message.from, 'Desculpe, seu assistente Dias encontrou um erro ao processar sua resposta, mas o proprietário será notificado.');
      }
    }
  
  });
}

//debug  && message.sender.id  === "244921712055@c.us"

 /*
   
    // Processar mensagens de documento
    if (message.type === 'document') {
      try {
        const fileBuffer = await client.downloadFile(message.id, 'document');
        console.log('Arquivo recebido na memória');
        await uploadFileToEndpoint(fileBuffer, sessionName);
      } catch (error) {
        console.error('Erro ao processar o documento:', error);
        await client.sendText(message.from, 'Desculpe, houve um erro ao processar o seu arquivo.');
      }
    }
    
    if (message.type === 'ptt'  && message.sender.id === '244921712055@c.us') {
      try {

        const filePath = './audio.ogg'; // Caminho do arquivo que você deseja salvar

        // Baixando o Blob de áudio
        const audioBlob = await client.downloadMedia(message.id);
    
        // Inspecionar o conteúdo do audioBlob
        console.log('audioBlob:', audioBlob);
    
        let audioBuffer;
    
        // Verificar se audioBlob é um Buffer
        if (audioBlob && audioBlob.data) {
 
          const base64Audio = audioBlob.data.split(',')[1];

          audioBuffer = Buffer.from(base64Audio, 'base64'); 
      
          fs.writeFileSync(filePath, audioBuffer);
    
        }

        // const transcription = await transcribeAudio(audioBlob);
        // const textContent = `${message.body} ${transcription}`;

        // const transcript = await transcribeAudio(audioBlob).then(async (transcription) => {
        //   const textContent = `${content} ${transcription}` || `Finja que você é um humano chamado Dias, cuja função é ajudar. Acabei de te enviar uma mensagem. ${transcription}`;

        //   const triggerResponse = await generateMessage.trigger({
        //     content: textContent || " ",
        //     message: message.body,
        //     domain: sessionName,
        //     username: message?.sender?.id,
        //     userNumber: message?.sender?.name,
        //     role:"cliente"
        //   }).then(async (response) => {
        //     const date = await waitForCompletion(response.id);
            
        //     const replyMessage = msg || msgGeral || 'Nenhuma resposta disponível no momento.';

        //     const replyAudio = await convertTextToAudio(replyMessage);
            
        //     await client.sendAudio(message.from, replyAudio);

        //   }).catch(async () => {
        //     await client.sendText(message.from, 'Desculpe, seu assistente Dias encontrou um erro ao processar sua resposta, mas o proprietário será notificado.');
        //   });
        // }).catch(async (response) => {
        //   await client.sendText(message.from, response);
        // });

        // console.log('Transcrição:', transcript);
        await client.sendText(message.from, `Aqui está a transcrição`);
      } catch (error) {
        console.error('Erro ao processar o áudio:', error);
        await client.sendText(message.from, 'Houve um erro ao processar seu áudio.');
      }
    }
  
async function uploadFileToEndpoint(fileBuffer: Buffer, sessionName: string) {
  const fileName = 'uploadedFile';
  try {
    const userData = await Adapter.findUserByEmail(sessionName);

    if (!userData) {
      console.error('Usuário não encontrado');
      return;
    }

    const { email: domain, id, role, name } = userData;

    const company = await Adapter.queryCompany({ domain });
    if (!company) {
      console.error('Empresa não encontrada');
      return;
    }

    const token = await authConfig.callbacks.accessToken(undefined, { email: domain, userId: id, role, name });

    if (!token) {
      console.error('Falha ao obter token de acesso');
      return;
    }

    const uploadResult = await uploadFile.trigger({
      token,
      file: fileBuffer,
      bucket: company?.externalId || "",
      filename: fileName,
      senderEmail: domain,
    });

    console.log('Arquivo enviado com sucesso para o endpoint:', uploadResult.data);
  } catch (error) {
    console.error('Erro ao enviar arquivo para o endpoint:', error);
  }
}

async function transcribeAudio(audioBlob: Buffer) {
  const audioBase64 = audioBlob.toString('base64');
  const audioBuffer = Buffer.from(audioBase64, 'base64');

  try {
    // Verificar se o áudio é do tipo esperado
    if (audioBuffer.length === 0) {
      throw new Error('Arquivo de áudio vazio.');
    }

    console.log('Iniciando transcrição do áudio...');
    
    const data = { audio: audioBuffer };

    // Verificar se o arquivo está em um formato suportado
    if (!audioBuffer || !audioBuffer.length) {
      throw new Error('Áudio inválido ou não carregado corretamente.');
    }

    const transcriptResponse = await client.transcripts.transcribe(data);
    
    if (!transcriptResponse || !transcriptResponse.text) {
      throw new Error('Falha na transcrição do áudio');
    }

    console.log('Transcrição concluída:', transcriptResponse.text);
    return transcriptResponse.text || 'Não conseguimos entender o áudio.';
  } catch (error) {
    console.error('Erro ao transcrever áudio:', error);
    throw new Error('Falha ao transcrever áudio');
  }
}

async function convertTextToAudio(text) {
  const gtts = new gTTS(text, 'pt');
  const outputFile = 'output.mp3';
  
  return new Promise((resolve, reject) => {
    gtts.save(outputFile, function (err) {
      if (err) {
        reject('Erro ao gerar áudio');
      } else {
        resolve(outputFile);
      }
    });
  });
}

  */
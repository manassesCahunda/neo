import { Adapter } from '@neo/auth';
import {
  app,
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from '@neo/firebase';
import { googleAI } from '@neo/openai';
import { socket } from '@neo/socket/client';
import {
  logger,
  task,
} from '@trigger.dev/sdk/v3';

import { publishWebhook } from './publishWebhook';

socket.on('connect', () => {
  console.log('Emissor conectado');
});

const db = getFirestore(app);

export const generateMessage = task({
  id: "generate-message",
  maxDuration: 30,
  run: async (payload: {
    role: string,
    content: string;
    message: string;
    domain: string;
    username: string;
    userNumber: string;
  }) => {
    const { content, message, domain, username, userNumber, role } = payload;
    let userData = await fetchUserData(username);
    const company = await fetchCompanyData(domain);
    
    const action = generateAction(content, company?.companyDataUser, company?.companyDataTransactionsString, userData, message, role);
    
    try {
      const responseText = await generateResponse(action);
      await updateUserMessages(username, message, userNumber, role, userData);
      socket.emit('sendMessage', responseText);
      await processWebhooks(domain, responseText, payload);

      return responseText;
    } catch (error) {
      logger.error("Erro no processo de envio:", error);
      throw error;
    }
  },
});

async function fetchUserData(username: string) {
  try {
    const userDocRef = doc(db, "clientStorage", username);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      return userDoc.data()?.mensagens || [];
    } else {
      console.log("Documento do usuário não encontrado! Criando novo...");
      await setDoc(userDocRef, { mensagens: [] });
      return [];
    }
  } catch (error) {
    logger.error("Erro ao buscar dados do usuário:", error);
    throw error;
  }
}

async function fetchCompanyData(domain: string) {
  let companyDataTransactionsString = "";
  let companyDataUser = "";
  
  try {

    const companyData = await Adapter.queryCompany({ domain });
    const companyDataTransactions = await Adapter.getAllTransactions({ Idcompany: companyData?.id });
    companyDataTransactionsString = JSON.stringify(companyDataTransactions);
    companyDataUser = JSON.stringify(companyData);
   
    return {
      companyDataTransactionsString,
      companyDataUser
    };
  } catch (error) {
    logger.error("Erro ao buscar dados da empresa:", error);
    throw error;
  }
}

function generateAction(content: string,companyDataUser:string, companyDataTransactionsString: string, userData: any[], message: string, role: string) {
  const Data = JSON.stringify(userData);
  return `
  O que você deve fazer:
  - ${content}.

  Se não for possível, finja sem que o usuário perceba.

  Dados da empresa:
  - Informações gerais: ${companyDataUser}
  - Dados transacionais: ${companyDataTransactionsString}
    (Nota: Esses dados não devem ser revelados a menos que o usuário seja responsável pelas faturas. Use-os para responder às perguntas e verificar permissões).

  Mensagem do usuário:
  - ${message}

  Informações sobre o usuário:
  - Dados: ${Data}
  - Permissão total: ${role}
`;

}

async function generateResponse(action: string) {
  try {
    const model = await googleAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent([action]);
    const responseText = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      throw new Error("Resposta inválida da API do Google.");
    }
    return responseText;
  } catch (error) {
    logger.error("Erro ao gerar resposta do modelo AI:", error);
    throw error;
  }
}

async function updateUserMessages(username: string, message: string, userNumber: string, role: string, userData: any[]) {
  try {
    const userDocRef = doc(db, "clientStorage", username);
    await updateDoc(userDocRef, {
      mensagens: [...userData, {
        mensagem: `Este usuário ${username} enviou a mensagem: ${message}, com o número ${userNumber} e nível de autenticação ${role}`,
        data: new Date(),
      }],
    });
  } catch (error) {
    logger.error("Erro ao atualizar dados do usuário:", error);
    throw error;
  }
}

async function processWebhooks(domain: string, responseText: string, payload: any) {
  try {
    const user = await Adapter.findUserByEmail(domain);
    const userId = user?.id;
    const webhooks = await Adapter.getWebhook({ userId });

    if (webhooks.length === 0) {
      logger.warn(`No webhooks found for userId: ${userId}`);
      return;
    }

    const data = { ...payload, message: responseText };
    for (const { url, channels, id, eventType } of webhooks) {
      if (channels === "bot") {
        const event = { url, eventType, id, channels };
        const webhook = await publishWebhook.trigger({
          payload: data,
          delayInSeconds: 12,
          event,
        });

        if (!webhook) {
          throw new Error(`Webhook trigger failed for user: ${userId}`);
        }

        logger.info("Webhook published successfully:", webhook);
      }
    }
  } catch (error) {
    logger.error("Erro ao processar webhooks:", error);
    throw error;
  }
}

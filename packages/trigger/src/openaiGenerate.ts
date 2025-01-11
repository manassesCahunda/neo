import {
  Adapter,
  parseToken,
} from '@neo/auth';
import { env } from '@neo/env';
import {
  generateConfirm,
  Nodemailer,
} from '@neo/mail';
import { googleAI } from '@neo/openai';
import { supabaseAdmin } from '@neo/supabase';
import {
  logger,
  task,
} from '@trigger.dev/sdk/v3';

import { publishWebhook } from './publishWebhook';

export const googleGenerate = task({
  id: "google-generate",
  maxDuration: 120,
  run: async (payload: { enterprise: string; filename: string; prompt: string; token: string; eventTypes: string; senderEmail: string }) => {
    const { enterprise, filename, prompt, token, eventTypes, senderEmail } = payload;
  
    const keys = [
      "companyName", "entity", "identify", "details", "dateInvoice",
      "expiryDate", "typeInvoice", "unitPrice", "amount", "total", "totalIVA", "balanceTotal"
    ];
  
    const content = `Pegue os dados correspondentes às chaves: ${keys.join(", ")} e crie um JSON simples com aspas duplas. Conteúdo: ${prompt}`;
  
    try {
      const model = await googleAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent([content]);
      const responseText = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text;
  
      if (!responseText) throw new Error("Resposta inválida da API do Google.");
  
      const formattedResponseText = formatJson(responseText);
      const jsonMatch = formattedResponseText.match(/{[^}]+}/);
      if (!jsonMatch) throw new Error("Formato JSON não encontrado na resposta.");
      
      const parsedJson = JSON.parse(jsonMatch[0]);
      const path = await handleFileMovement(enterprise, filename, parsedJson);
  
      logger.info("JSON preparado para transações:", parsedJson);
      const user = parseToken(token);
      if (!user) throw new Error(`Token do provedor é inválido: ${user}`);
  
      const { userId, email } = user;
      
      Object.assign(parsedJson, {
        userId,
        idFile: path,
        amount: convertToObject(parsedJson.amount),
        unitPrice: convertToObject(parsedJson.unitPrice),
        total: convertToObject(parsedJson.total),
        totalIVA: convertToObject(parsedJson.totalIVA),
        balanceTotal: convertToObject(parsedJson.balanceTotal),
        details: `${email}`,
        senderEmail,
      });
  
      const transactions = await Adapter.createTransactions(parsedJson);
      
      if (!transactions) {
        const getWebhooks = await Adapter.getWebhook({ userId });
        
        if (getWebhooks.length === 0) {
          logger.info(`No webhooks found for userId: ${userId}`);
          return true;
        }
    
        for (const { url, channels, id, eventType } of getWebhooks) {
          if (channels === eventTypes) {
            const event = { url, eventType, id, channels };
            const webhook = await publishWebhook.trigger({
              payload: parsedJson,
              delayInSeconds: 12,
              event,
            });
    
            if (!webhook) {
              throw new Error(`Webhook trigger failed for user: ${userId}`);
            }
    
            logger.info("Webhook published successfully:", webhook);
          }
        }
    
        if (eventTypes === "email" && senderEmail) {
          const htmlContent = await generateConfirm(
            "success",               
            "Erro ao receber ficheiro", 
            senderEmail,      
            enterprise   
          );
          
          const date = await Nodemailer.sendMail({
            from: env.EMAIL,
            to: senderEmail,
            subject: 'Valide de envio',
            text: 'Confirmacao de envio do Ficheiro',
            html: htmlContent,
          });

          if (!date) {
            throw new Error(`Erro ao receber ficheiro`);
          }
        }

        return true;
      }

    } catch (error) {
      if (eventTypes === "email" && senderEmail) {
        const htmlContent = await generateConfirm(
          "error",             
          "Erro ao receber ficheiro", 
          senderEmail,      
          enterprise      
        );
                
        const date = await Nodemailer.sendMail({
          from: env.EMAIL,
          to: senderEmail,
          subject: 'Valide de envio',
          text: 'Confirmacao de envio do Ficheiro',
          html: htmlContent,
        });

        if (!date) {
          throw new Error(`Erro ao receber ficheiro`);
        }
      }

      logger.error('Erro ao gerar texto com o Google Generative AI', error);
      throw error;
    }
  }  
});

async function handleFileMovement(enterprise: string, filename: string, parsedJson: any) {
  const normalizeString = (str: string) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]/g, "_")
      .toLowerCase();
  };

  const typeInvoice = normalizeString(parsedJson.typeInvoice || "unknown");
  const companyNameFormat = normalizeString(parsedJson.companyName || "");

  const fileExists = await supabaseAdmin.storage.from(enterprise).list('unknown', { search: filename });

  if (fileExists.data.length > 0) {
    const storagePath = enterprise === parsedJson.companyName
      ? `enterprise/${typeInvoice}/${filename}`
      : `client/${typeInvoice}/${companyNameFormat}/${filename}`;

    logger.info(`Tentando mover o arquivo de: unknown/${filename} para: ${storagePath}`);

    const moveResult = await supabaseAdmin.storage.from(enterprise).move(`unknown/${filename}`, storagePath);
    if (moveResult.error) {
      logger.error(`Erro ao mover arquivo: ${moveResult.error.message}`);
      throw new Error(`Erro ao mover arquivo: ${moveResult.error.message}`);
    }

    return storagePath;

  } else {
    logger.info(`Arquivo ${filename} não encontrado em 'unknown'. Nenhuma ação necessária.`);
    return "";
  }
}

function convertToObject(value: any) {
  if (Array.isArray(value)) {
    return value.reduce((acc, curr, index) => {
      acc[`item${index + 1}`] = curr; 
      return acc;
    }, {});
  }
  return (typeof value === 'string' || typeof value === 'number') ? { value } : {};
}

function formatJson(jsonString: string): string {
  return jsonString.replace(/'([^']+)'/g, '"$1"');
}

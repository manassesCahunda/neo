import {
  merge,
  Observable,
} from 'rxjs';

import {
  Adapter,
  authConfig,
} from '@neo/auth';
import {
  configMail,
  MailListener,
} from '@neo/mail/imap';
import { uploadFile } from '@neo/trigger';
import { logger } from '@neo/winston';

function hasPdfAttachment(mail) {
  return mail.attachments && mail.attachments.some((attachment) => attachment.contentType === 'application/pdf');
}

export function createMailListener(username, password, host) {
  return new Observable((subscriber) => {
    const config = configMail({ username, password, host });
    const imap = new MailListener(config);

    const handleReconnect = () => {
      logger.info(`Reconectando ao servidor de e-mails para ${username}...`);
      imap.start();
    };

    imap.on("attachment", async (attachment,sendEmail,attachmentBuffer, seqno, attrs) => {
      try {
        logger.info(`Anexo recebido: ${JSON.stringify(attachment)}`);
        const fileName = attachment.filename;

        const sendArray = Array.from(sendEmail);

        function getRemetente(data) {
          const fromItem = data.find(item => item[0] === "from");         
          if (fromItem && fromItem[1] && fromItem[1].value && Array.isArray(fromItem[1].value)) {

            return fromItem[1].value[0].address; 
          }
          return null;
        }

                  
        const email = username;
        const key = password;
        const connect = true;
        
        await Adapter.updateExternalApiKey(email, host,key,connect);

        const remetente = getRemetente(sendArray);

        const sendJson = JSON.stringify(sendArray);

        const userData = await Adapter.findUserByEmail(username);

        if (!userData) {
          logger.error('Erro ao recuperar dados do usuário');
          return; 
        }

        const { email:domain, id, role, name } = userData;

        const company = await Adapter.queryCompany({ domain });
        if (!company) {
          logger.error('Erro ao recuperar dados da empresa');
          return; 
        }

        const token = await authConfig.callbacks.accessToken(undefined, { email, userId: id, role, name });
        
        if (!token) {
          logger.error("Erro ao gerar token de acesso");
          return; 
        }


        const uploadResult = await uploadFile.trigger({
          token, 
          file: attachmentBuffer, 
          bucket: company?.externalId || "", 
          filename: fileName,
          senderEmail: remetente  
        });
        
        if (uploadResult) {     
          logger.info(`Arquivo ${fileName} carregado com sucesso. Remetente: ${remetente}`);
        } else {
          logger.error("Erro ao fazer upload do arquivo.");
        }
      } catch (error) {
        logger.error(`Erro ao processar o anexo ${attachment.filename}:`, error);
      }
    });

    imap.on("mail", async(mail) => {
      try {
        if (mail.flags && mail.flags.indexOf('\\Seen') === -1 && hasPdfAttachment(mail)) {
          logger.info("Novo e-mail recebido com PDF.");
          const senderEmail = mail.from.text;  
          
            const email = username;
            const key = password;
            const connect = true;
            await Adapter.updateExternalApiKey(email, host,key,connect);
    
          logger.info(`Remetente: ${senderEmail}`);
        }
      } catch (error) {
        logger.error(`Erro ao processar o e-mail ${mail.id}:`, error);
      }
    });

    imap.start();

    imap.on("connect", async () => {
      try {
          logger.info(`Conectado ao servidor de e-mails para ${username}.`);
          
          const email = username;
          const key = password;
          const connect = true;
          await Adapter.updateExternalApiKey(email, host,key,connect);
   
      } catch (error) {
          logger.error(`Erro ao atualizar a API Key: ${error.message}`);
      }
  });
  

    imap.on("disconnect", async (reason) => {
      logger.info(`Desconectado do servidor de e-mails para ${username}:`, reason);
      
    });

    imap.on("error",async (error) => {
      logger.error(`Erro ocorreu para ${username}:`, error);

      try {
        logger.info(`Conectado ao servidor de e-mails para ${username}.`);
        
        const email = username;
        const key = password;
        const connect = false;
        await Adapter.updateExternalApiKey(email, host, key,connect);

        } catch (error) {
            logger.error(`Erro ao atualizar a API Key: ${error.message}`);
        }

      if (!subscriber.closed) {
        subscriber.error(error);
      }
    });

    return () => {
      logger.info(`Parando o listener para ${username}.`);
      imap.stop();
    };
  });
}

export function initializeMultipleMailListeners(accounts) {
  const listeners = accounts.map(account => createMailListener(account.username, account.password, account.host));
  return merge(...listeners);
}

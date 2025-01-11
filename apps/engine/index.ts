import { Adapter } from '@neo/auth';
import { initialize } from '@neo/wppconnect';
import { logger } from '@neo/winston';
import { io } from '@neo/socket';
import { initializeMultipleMailListeners } from './infras/imap-connect';

async function processEmails() {
  try {
    const companies = await Adapter.getAllCompany();

    const emailAccounts = companies
      .map(company => {
        const { externalApiKey } = company || {};
        if (externalApiKey) {
          return {
            username: externalApiKey?.email,
            password: externalApiKey?.key,
            host: externalApiKey?.host,
          };
        }
        return null;
      })
      .filter(Boolean);

    if (emailAccounts.length > 0) {
      const mailListener$ = initializeMultipleMailListeners(emailAccounts);
      mailListener$.subscribe({
        next: (mail) => {
          logger.info(`Novo e-mail processado de: ${mail.from}, Assunto: ${mail.subject}`);
        },
        error: (error) => {
          logger.error('Erro ao receber e-mail:', error.message || error);
        },
        complete: () => {
          logger.info('Todos os listeners de e-mail foram concluídos.');
        },
      });
    } else {
      console.log('Nenhuma conta de e-mail para inicializar.');
    }
  } catch (error) {
    logger.error('Erro ao processar e-mails:', error.message || error);
  }
}

async function initializeWithRetry(account, retries = 3, backoff = 1000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Tentativa ${attempt} de inicializar a sessão para ${account?.username} no domínio ${account?.domain}`);
      await initialize(account?.username, { domain: account?.domain });
      console.log(`Sessão inicializada para ${account?.username} no domínio ${account?.domain}`);
      return;
    } catch (error) {
      console.error(`Erro na tentativa ${attempt} para ${account?.username} no domínio ${account?.domain}:`, error.message || error);
      if (attempt === retries) {
        throw new Error(`Falha ao inicializar após ${retries} tentativas para ${account?.username} no domínio ${account?.domain}`);
      }
      await new Promise(resolve => setTimeout(resolve, backoff * attempt));
    }
  }
}

async function processWhatsApp() {
  try {
    const companies = await Adapter.getAllCompany();

    const accounts = companies
      .map(company => {
        const { externalApiKey, domain } = company || {};
        if (externalApiKey) {
          return {
            username: externalApiKey?.email,
            domain: domain,  // Adicionando domínio ao objeto de conta
          };
        }
        return null;
      })
      .filter(Boolean);

    if (accounts.length > 0) {
      await Promise.all(accounts.map(account => initializeWithRetry(account, 3, 1000)));
      console.log('Sessões WhatsApp inicializadas para todos os usuários');
    } else {
      console.log('Nenhuma conta WhatsApp para inicializar.');
    }
  } catch (error) {
    logger.error('Erro ao processar WhatsApp:', error.message || error);
  }
}

function initializeWebSocket() {
  io.on('connection', (socket) => {
    console.log('Novo cliente conectado.');

    socket.on('sendMessage', (data) => {
      console.log(`Servidor emissor: ${data}`);
      socket.emit('message', data);
      io.emit('response', data);
    });
  });

  console.log('Servidor Socket.io rodando na porta 8080');
}

async function runAllProcesses() {
  try {
    await Promise.all([ 
      processEmails(),
      processWhatsApp(),
      new Promise((resolve) => {
        initializeWebSocket();
        resolve();
      })
    ]);

    console.log('Todos os processos estão rodando em paralelo.');
  } catch (error) {
    logger.error('Erro ao inicializar todos os processos:', error.message || error);
  }
}

runAllProcesses();

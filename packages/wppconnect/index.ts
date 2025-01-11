import {
    app,
    doc,
    getFirestore,
    setDoc,
  } from '@neo/firebase';
  
  import { connect } from './src';
  
  const wppconnect = require('@wppconnect-team/wppconnect');
  
   const db = getFirestore(app);
  
   let Client = null;
  
  async function Delay(sessionName) {
      return new Promise((resolve, reject) => {
          wppconnect.create({
              session: sessionName,
              headless: true,
              catchQR: (base64Qrimg, asciiQR, attempts, urlCode) => {
                  resolve({ qrcode: urlCode });
              },
              depurador: false,
              logQR: false,
              debug: false,
              disableWelcome: false, // Option to disable the welcoming message which appears in the beginning
              updatesLog: false,
              devtools: false,
              useChrome: false,
              puppeteerOptions: {
                  args: [
                      '--no-sandbox',
                      '--disable-setuid-sandbox'  // Corrigido aqui: fechando a string corretamente
                  ]
              },
              browserArgs: ['--no-sandbox', '--disable-setuid-sandbox'],
              autoClose: false
          }).then((wppClient) => { 
                Client = wppClient;
               connect(wppClient,sessionName)})
          .catch(reject);
      });
  }
  
   export async function initialize(sessionName) {
      try {
          const { qrcode } = await Delay(sessionName);
           const webhookDocRef = doc(db, 'qrcode', "unique");
           await setDoc(webhookDocRef, { qrcode },{ merge: true });
           console.log(qrcode);
          return qrcode;
      } catch (error) {
          console.error("Error during initialization:", error);
          throw new Error('Failed to initialize WhatsApp session');
      }
  }
  
  
  export const getClient = () => {
      if (Client) {
        return Client;
      } else {
        throw new Error('Client is not initialized yet');
      }
  };
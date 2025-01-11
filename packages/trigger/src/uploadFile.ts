import { v4 as uuidv4 } from 'uuid';

import { task } from '@trigger.dev/sdk/v3';
import { env } from '@neo/env';
import {
  generateConfirm,
  Nodemailer,
} from '@neo/mail';

export const uploadFile = task({
  id: "upload-File",
  maxDuration: 120,
  run: async (payload: { token: string, file: Buffer, bucket: string, filename: string , senderEmail:string}) => {
    const { token, file, bucket, filename , senderEmail} = payload;
    const blob = new Blob([file], { type: 'application/pdf' });
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    const formData = new FormData();
    formData.append('file', blob, filename);
    const fileName = `${uuidv4()}.pdf`;

    try {
      const response = await fetch(`http://localhost:3000/api/upload?bucket=${bucket}&path=unknown&filename=${fileName}&eventType=email&senderEmail=${senderEmail}`, {
        method: 'POST',
        headers: myHeaders,
        body: formData,
      });

      if (!response.ok) {
        const errorResponse = await response.text();
        throw new Error(`Upload failed: ${errorResponse}`);
      }
      
      const result = await response.text();
      
      return result;

    } catch (error) {

      
      const htmlContent = await generateConfirm(
        "error",               
        "Erro ao receber ficheiro", 
        senderEmail,      
        "Neo smart Business"   
      );
      
        
      const date = await Nodemailer.sendMail({
        from: env.EMAIL,
        to: senderEmail,
        subject: 'Valide de envio',
        text: 'Confirmacao de envio do Ficheiro',
        html: htmlContent,
      });


      if(!date){
        throw new Error(`Erro ao receber ficheiro`);
      }

      throw error;
    }
  },
});

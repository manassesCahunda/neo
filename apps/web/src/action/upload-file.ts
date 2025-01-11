'use server';

import { HTTPError } from 'ky';

import { serverClient } from '@/lib/trpc/server';

export const uploadFile = async (uploadData: any) => {
  try {
    const uploadResponse = await serverClient.uploadTransactions(uploadData);
    
    // const recordeId = `${uuidv4()}`; 

    // if(uploadResponse){   
    //   const notification =  await serverClient.pushNotifications({
    //     id: recordeId,
    //     read: "user@example.com",
    //     createdAt: new Date().toISOString(),
    //     payload: {
    //       description: `Descrição carregamento do ficheiro ${uploadData.fileName}`,
    //       recordId: "trans-1",
    //       type: "Informação", 
    //     }
    // //   });

    //   return notification;
    // }

    return uploadResponse ?? null;

  } catch (error) {
    if (error instanceof HTTPError) {
      console.error('Error uploading:', error.response.status);
    } else {
      console.error('Unexpected error during upload:', error);
    }
    throw error; 
  }
};

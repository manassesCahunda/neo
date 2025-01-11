'use server';

import { HTTPError } from 'ky';

import { serverClient } from '@/lib/trpc/server';

export const acessEmail = async (email: string,companyId?: string,companyName?: string,userProvider?:string) => {
  try {
    const acessEmail = await serverClient.acessToken({ address: email,companyId,companyName,userProvider});
    return { success: true, data: acessEmail };
  } catch (error) {
    if (error instanceof HTTPError) {
      console.error('Error:', error.response.status);
      return { success: false, message: 'Failed to access email: ' + error.response.status };
    } else {
      console.error('Unexpected error:', error);
      return { success: false, message: 'Unexpected error occurred.' };
    }
  }
};

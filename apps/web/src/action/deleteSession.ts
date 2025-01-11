'use server';

import { HTTPError } from 'ky';
import { cookies } from 'next/headers';

export const deleteSession = async () => {
    try {
      const cookieStore = await  cookies();
      cookieStore.delete('sessionId');
      cookieStore.delete('token');
      cookieStore.delete('refreshToken');

    } catch (error) {
      const message = error instanceof HTTPError ? error.response.statusText : 'An unexpected error occurred';
      return { success: false, message: 'Failed to access the account: ' + message };
    }
};

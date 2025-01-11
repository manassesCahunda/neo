/**
 * The following function retrieves notifications from the server using the `serverClient.getNotifications`.
 * 
 * It handles both HTTP errors and unexpected errors, logging relevant messages for debugging purposes.
 */

'use server'; 

import { serverClient } from '@/lib/trpc/server';
import { HTTPError } from 'ky';

export const getNotifications = async () => {
  try {
    const notifications = await serverClient.getNotifications(); 
    return notifications; 
  } catch (error) {
    if (error instanceof HTTPError) {
      console.error('Error fetching notifications:', error.response.status);
    } else {
      console.error('Unexpected error during fetching notifications:', error);
    }
    throw error;
  }
};

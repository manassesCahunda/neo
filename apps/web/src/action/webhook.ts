
'use server';

import { HTTPError } from 'ky';

import { serverClient } from '@/lib/trpc/server';

export const queryWebhook = async () => {
    try {
        const webhooks = await serverClient.queryWebhooks();
        return webhooks;
    } catch (error) {
        if (error instanceof HTTPError) {
        console.error('Error:', error.response.status);
        } else {
        console.error('Unexpected error:', error);
        }
        throw error;
    }
};


export const createWebhooks = async ({
    name,
    url,
    channels,
    eventType,
    status,
  }: {
    name: string;
    url: string;
    channels: string;
    eventType: string;
    status: boolean;
  }) => {
    try {
      const webhooks = await serverClient.createWebhooks({
        name,
        url,
        channels,
        eventType,
        status,
      });
      return webhooks;
    } catch (error) {
      if (error instanceof HTTPError) {
        console.error('Error:', error.response.status);
      } else {
        console.error('Unexpected error:', error);
      }
      throw error;
    }
  };
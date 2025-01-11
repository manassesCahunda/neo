'use server';

import { HTTPError } from 'ky';

import { serverClient } from '@/lib/trpc/server';

export const getUrl = async (bucket: string, folders: string) => {
    try {
        const url = await serverClient.getUrlFiles({ bucket, folders });
        return url;
    } catch (error) {
        if (error instanceof HTTPError) {
            console.error('HTTP Error:', error.response.status, await error.response.text());
        } else {
            console.error('Unexpected error:', error);
        }
        throw new Error('Failed to retrieve the signed URL. Please try again later.');
    }
};

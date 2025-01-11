
'use server';

import { HTTPError } from 'ky';

import { serverClient } from '@/lib/trpc/server';

export const queryUser = async () => {
    try {
        const user = await serverClient.queryUser();
        return user;
    } catch (error) {
        if (error instanceof HTTPError) {
        console.error('Error:', error.response.status);
        } else {
        console.error('Unexpected error:', error);
        }
        throw error;
    }
};
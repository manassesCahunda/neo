'use server';

import { HTTPError } from 'ky';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { serverClient } from '@/lib/trpc/server';

export const acessAccount = async (email: string, password: string) => {
    try {
        const acessEmail = await serverClient.acessUser({ address: email, password });

        const cookieStore = await cookies();

        cookieStore.set('sessionId', acessEmail.sessionId, { httpOnly: true, maxAge: 60 * 60 , path :"/"});
        cookieStore.set('token', acessEmail.acessToken, { httpOnly: true, maxAge: 60 * 60 * 24 * 3 , path :"/"});
        cookieStore.set('refreshToken', acessEmail.refreshToken, { httpOnly: true, maxAge: 60 * 60 * 24 * 7 , path :"/"});

        return { success: true, data: acessEmail };

    } catch (error) {
        if (error instanceof HTTPError) {
            console.error('Erro:', error.response.status);
            redirect('/auth');
        } else {
            console.error('Erro inesperado:', error);
            redirect('/error');
        }
    }
};

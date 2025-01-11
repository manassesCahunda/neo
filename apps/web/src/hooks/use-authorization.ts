"use server";

import { HTTPError } from 'ky';
import { cookies } from 'next/headers';

import { serverClient } from '@/lib/trpc/server';

export const Authorized = async () => {
    try {
        const authorized = await serverClient.authorized();

        const cookieStore = await cookies();

        if (authorized.sessionId) {
            cookieStore.set('sessionId', authorized.sessionId, { httpOnly: true, maxAge: 60 * 60 });
        }

        if (authorized.token) {
            cookieStore.set('token', authorized.token, { httpOnly: true, maxAge: 60 * 60 * 24 * 3 });
        }

        if (authorized.refreshToken) {
            cookieStore.set('refreshToken', authorized.refreshToken, { httpOnly: true, maxAge: 60 * 60 * 24 * 7 });
        }

        return { success:true , message:authorized};
    } catch (error) {

        const cookieStore = await cookies();

        cookieStore.delete('sessionId');
        cookieStore.delete('token');
        cookieStore.delete('refreshToken')
        
        if (error instanceof HTTPError) {
            console.error('Erro:', error.response.status);
            return { success: false, message: 'Falha ao acessar o e-mail: ' + error.response.status };
        } else {
            console.error('Erro inesperado:', error);
            return { success: false, message: 'Ocorreu um erro inesperado.' };
        }
    }
};

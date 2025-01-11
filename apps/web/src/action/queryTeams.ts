
'use server';

import { serverClient } from '@/lib/trpc/server';
import { HTTPError } from 'ky';


export const querTeams = async () => {
    try {
        const viewTeams = await serverClient.queryTeams();
        return viewTeams;
    } catch (error) {
        if (error instanceof HTTPError) {
        console.error('Error:', error.response.status);
        } else {
        console.error('Unexpected error:', error);
        }
        throw error;
    }
};


export const createTeams = async (name:string,amount:string) => {
    try {
        const createTeams = await serverClient.createTeams({name,amount});
        return createTeams;
    } catch (error) {
        if (error instanceof HTTPError) {
        console.error('Error:', error.response.status);
        } else {
        console.error('Unexpected error:', error);
        }
        throw error;
    }
};
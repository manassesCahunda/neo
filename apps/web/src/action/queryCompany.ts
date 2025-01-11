'use server';

import { HTTPError } from 'ky';

import { serverClient } from '@/lib/trpc/server';

export const CompanyDate = async () => {
    try {
        const company = await serverClient.queryCompany();
        console.log(company);
        return company;
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

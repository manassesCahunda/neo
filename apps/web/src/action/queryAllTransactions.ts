'use server';

import { HTTPError } from 'ky';
import { serverClient } from '@/lib/trpc/server';

interface TransactionResult {
  success: boolean;
  message: string;
  data: any;
}

export const AllTransactions = async (): Promise<TransactionResult> => {
  try {
    
    const transactions = await serverClient.AllTransactions();

    return { 
      success: true, 
      message: 'Transactions retrieved successfully', 
      data: transactions 
    };
  } catch (error) {
    if (error instanceof HTTPError) {
      console.error('HTTP Error:', error.response.status);
      return { 
        success: false, 
        message: `Failed to access transactions. Status: ${error.response.status}`,
        data: [] 
      };
    } else {
      console.error('Unexpected error:', error);
      return { 
        success: false, 
        message: 'An unexpected error occurred.', 
        data: [] 
      };
    }
  }
};

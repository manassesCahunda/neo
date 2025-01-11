/**
 * The following functions handle the sending and verifying of OTP requests for company data.
 * 
 * `sendOtpRequest` sends an OTP email to the specified company using the `serverClient.validateDomain`.
 * If an error occurs, it handles both HTTP errors and unexpected errors, logging the relevant messages.
 * 
 * `verifyOtpRequest` verifies the OTP using the provided company data with the `serverClient.createCompany`.
 * It returns the validation result or false if the validation fails, also handling errors in a similar manner.
 */

'use server';

import { serverClient } from '@/lib/trpc/server';
import { HTTPError } from 'ky';

interface CompanyData {
  email: string;
  otp?: string;
  otpId?: string;
}

export const sendOtpRequest = async (companyData: CompanyData) => {
  try {
    const sendEmail = await serverClient.validateDomain(companyData);
    return sendEmail;
  } catch (error) {
    if (error instanceof HTTPError) {
      console.error('Error:', error.response.status);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};

export const verifyOtpRequest = async (companyData: CompanyData) => {
  try {
    const validate = await serverClient.createCompany(companyData);

    if (validate) {
      return validate;
    }

    return false;
  } catch (error) {
    if (error instanceof HTTPError) {
      console.error('Error:', error.response.status);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};

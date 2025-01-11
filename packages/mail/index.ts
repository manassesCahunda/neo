import nodemailer from 'nodemailer';

import { env } from '@neo/env';
import { render } from '@react-email/render';

import { ValidateEmail } from './templates/autenticate-link';
import { FileUploadConfirmationEmail } from './templates/confirm-send';
import { ValidateOpt } from './templates/validate-otp';
import { OrganizationInviteEmail } from './templates/convite-link';

export const Nodemailer = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.EMAIL,
    pass: env.EMAIL_PASSOWRD, 
  },
});


const generateEmailHtml = async (template:any,data:any) => {
  try {
    return await render(template(data));
  } catch (error) {
    console.error('Erro ao gerar HTML do e-mail:', error);
    throw error;
  }
};

export const generateValidateEmailHtml = (user:any) => generateEmailHtml(ValidateEmail, user);
export const generateValidateOptHtml = (otp:any) => generateEmailHtml(ValidateOpt,{ otp });
export const generateConfirm = (
  status: string, 
  errorMessage: string, 
  user: string, 
  company: string
)=> generateEmailHtml(FileUploadConfirmationEmail,{
  status,
  errorMessage,
  user,
  company
});
export const generateInviteEmail = (
  username: string,
  organizationName: string,
  inviteLink: string,
)=> generateEmailHtml(OrganizationInviteEmail,
  {
    username,
    organizationName,
    inviteLink,
  });



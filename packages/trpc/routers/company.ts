import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

import {
  Adapter,
  parseToken,
} from '@neo/auth';
import { env } from '@neo/env';
import {
  generateValidateOptHtml,
  Nodemailer,
} from '@neo/mail';
import {
  generateOtp,
  validateOtp,
} from '@neo/otp';
import { TRPCError } from '@trpc/server';

import {
  createTRPCRouter,
  protectedProcedure,
} from '../trpc';

/**
 * The company router provides functionality for domain validation and company creation
 * using OTP (One-Time Password) for security.
 */

export const company = createTRPCRouter({
  validateDomain: protectedProcedure
    .input(
      z.object({
        email: z.string().email({ message: 'Invalid email' }),
      })
    )
    .mutation(async ({ input }) => {
      const { email } = input;
      const { otp, otpId } = await generateOtp();

      // Generate HTML content for the OTP email
      const htmlContent = await generateValidateOptHtml(otp);
      
      const date = await Nodemailer.sendMail({
        from: env.EMAIL,
        to: email,
        subject: 'Your One-Time Use Code',
        text: 'Domain validation',
        html: htmlContent,
      });
      
      if (!date) {
        throw new TRPCError({
          message: 'This email is used by another profile',
          code: 'BAD_REQUEST',
        });
      }

      return { otp, otpId };
    }),

  createCompany: protectedProcedure
    .input(
      z.object({
        email: z.string().email({ message: 'Invalid email' }),
        otp: z.string().length(6, { message: 'OTP must be 6 characters' }),
        otpId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const companyId = uuidv4();
      const { otp, otpId, email } = input;

      const isValid = await validateOtp(otpId, otp);

      if (typeof email !== 'string') {
        throw new TRPCError({
          message: 'Email is not valid',
          code: 'BAD_REQUEST',
        });
      }
    
      const [, domain] = email.split('@');
      
      if (!domain || !domain.includes('.')) {
        throw new TRPCError({
          message: 'Domain is not valid',
          code: 'BAD_REQUEST',
        });
      }
    
      const [name] = domain.split('.');
    
      if (!isValid) {
        throw new TRPCError({
          message: 'Invalid OTP',
          code: 'BAD_REQUEST',
        });
      }

      const company = Adapter.createCompany({ id: companyId, name, domain: email ,externalId:name});
    
      if (!company) {
        throw new TRPCError({
          message: 'Error in connection with Database',
          code: 'BAD_REQUEST',
        });
      }
    
      return companyId;
    }),
    queryCompany: protectedProcedure
    .query(async ({ ctx }) => {
    
      const { token } = ctx ;

      const user = parseToken(token) ;

      if (!user) {
        throw new TRPCError({
          message: 'Error Provider UserDate',
          code: 'BAD_REQUEST',
        });
      }

      const company = await Adapter.queryCompany({domain:user.email})

  
      if (!company) {
        throw new TRPCError({
          message: 'Error in connection with Database',
          code: 'BAD_REQUEST',
        });
      }

      return company;
    }),

    createTeams: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        amount: z.string(),
      })
    )
    .mutation(async ({ input , ctx}) => {
    
      const  { name , amount } = input ;

      const token = ctx.token;

      const user = parseToken(token) ;

      if (!user) {
        throw new TRPCError({
          message: 'Error Provider UserDate',
          code: 'BAD_REQUEST',
        });
      }

      console.log(user);

      const domain = user?.email  || "";

      console.log(domain);
      
      const company = await Adapter.createTeams({ name , domain , amount})

          
      if (!company) {
        throw new TRPCError({
          message: 'Error in connection with Database',
          code: 'BAD_REQUEST',
        });
      }

      return company;

    }),
    queryTeams: protectedProcedure
      .query(async ({ ctx }) => {
      
        const { token } = ctx ;

        const user = parseToken(token)  ;

        if (!user) {
          throw new TRPCError({
            message: 'Error Provider UserDate',
            code: 'BAD_REQUEST',
          });
        }

        const company = await Adapter.getTeams({domain:user.email})


            
      if (!company) {
        throw new TRPCError({
          message: 'Error in connection with Database',
          code: 'BAD_REQUEST',
        });
      }

        return company;
    }),

    queryWebhooks : protectedProcedure
    .query(async ({ ctx }) => {
    
      const { token } = ctx ;

      const { userId } = parseToken(token)  ;
      
      if (!userId) {
        throw new TRPCError({
          message: 'Error Provider UserDate',
          code: 'BAD_REQUEST',
        });
      }

      const webhooks = await Adapter.getAllWebhooks(userId);

      if (!webhooks) {
        throw new TRPCError({
          message: 'Error Provider Webhooks',
          code: 'BAD_REQUEST',
        });
      }

      return webhooks;
  }),
 createWebhooks: protectedProcedure
  .input(
    z.object({
      name: z.string(),
      url: z.string().url(),
      channels: z.string(),
      eventType: z.string(),
      status: z.boolean(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    
    const token = ctx.token;

    const { userId } = parseToken(token);

    if (!userId) {
      throw new TRPCError({
        message: 'User not authenticated',
        code: 'UNAUTHORIZED',
      });
    }

    const { name, url, channels, eventType, status } = input;

    const webhook = await Adapter.createWebhooks({
      userId,
      name,
      url,
      channels,
      eventType,
      status,
    });

    if (!webhook) {
      throw new TRPCError({
        message: 'Error creating webhook',
        code: 'BAD_REQUEST',
      });
    }

    return webhook;
  })
});

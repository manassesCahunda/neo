/**
 * This TRPC router provides several protected user account procedures.
 * 
 * Procedures:
 * - `createAccount`: Creates a new user account by providing name, email, passwordHash, and companyId.
 * - `acessUser`: Authenticates a user by verifying their email and password, and returns session, access token, and refresh token.
 * - `acessToken`: Generates an access token for the provided email, sends a validation email, and returns a success response if the email is sent successfully.
 */

import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

import {
  Adapter,
  authConfig,
  parseToken,
} from '@neo/auth';
import { verifyPassword } from '@neo/bcrypt';
import { env } from '@neo/env';
import {
  generateValidateEmailHtml,
  generateInviteEmail,                     
  Nodemailer,
} from '@neo/mail';
import { TRPCError } from '@trpc/server';

import {
  createTRPCRouter,
  protectedProcedure,
} from '../trpc';

export const user = createTRPCRouter({
  createAccount: protectedProcedure
    .input(
      z.object({
        name: z.string().min(5),
        email: z.string().min(5).email({ message: 'Invalid Email' }),
        passwordHash: z.string(),
        companyId: z.string(),
        role: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { name, email, passwordHash, companyId ,role } = input;
      
      const userdb = Adapter.createUser({
        name,
        email,
        companyId,
        passwordHash,
        role,
      });

      if (!userdb) {
        throw new TRPCError({
          message: 'error sending email to provided address',
          code: 'BAD_REQUEST',
        });
      }

      return userdb ?? null;
    }),

  acessUser: protectedProcedure
    .input(
      z.object({
        address: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { address, password } = input;
      const findUser = await Adapter.findUserByEmail(address);

      const { id, name, email, role, passwordHash } = findUser;

      const passwordhash = await verifyPassword(password, passwordHash);

      if (!passwordhash) {
        throw new TRPCError({
          message: 'Error: The password is invalid',
          code: 'BAD_REQUEST',
        });
      }

      const userId = id;
      
      const refreshToken = await authConfig.callbacks.refreshToken({name,userId,email,role});

      const acessToken = await authConfig.callbacks.accessToken(refreshToken,undefined);

      const sessionId = await authConfig.callbacks.session(acessToken,undefined);
  
      return {
        sessionId,
        acessToken,
        refreshToken,
      };
    }),
    acessToken: protectedProcedure
    .input(
      z.object({
        address: z.string().email({ message: 'Invalid email' }),
        companyId: z.string().optional(),
        userProvider: z.string().optional(),
        companyName: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {

      const { address, companyId, companyName , userProvider } = input;
  
       const findUser = await Adapter.findUserByEmail(userProvider || address);
  
        if (!findUser) {
          throw new TRPCError({
            message: 'Error creating token: user not found',
            code: 'BAD_REQUEST',
          });
        }
  
        const { email, name, id: userId, role } = findUser;

        
        const  acessToken = await authConfig.callbacks.session(undefined, {
          name,
          userId,
          email,
          role,
        });
  
        const refreshToken = await authConfig.callbacks.refreshToken({
          name,
          userId,
          email,
          role,
        });
  
        const token = await authConfig.callbacks.accessToken(undefined, {
          name,
          userId,
          email,
          role ,
        });
  
        if (!acessToken || !refreshToken || !token) {
          throw new TRPCError({
            message: 'Error creating tokens',
            code: 'BAD_REQUEST',
          });
        }
  
  
        const idToken = uuidv4();

        const createSession = await Adapter.createSession(
          token,
          refreshToken,
          idToken,
          userId,
          'Bearer'
        );
  
        if (!createSession) {
          throw new TRPCError({
            message: 'Error creating session',
            code: 'BAD_REQUEST',
        });
       }

        const createToken = await Adapter.createAccessToken(acessToken, false, idToken);
  
        if (!createToken) {
          throw new TRPCError({
            message: 'Error saving access token',
            code: 'BAD_REQUEST',
          });
        }
  
      const accessLink = `${env.URL}/api/acess?token=${acessToken}&companyId=${companyId || ''}`;
  
      const htmlContent = companyId
        ? await generateInviteEmail(address,companyName || '', accessLink)
        : await generateValidateEmailHtml({ username:name, accessLink });

      const emailResult = await Nodemailer.sendMail({
        from: env.EMAIL,
        to: address,
        subject: 'Validate Your Email',
        text: 'Verify ownership of your email address',
        html: htmlContent,
      });
  
      if (!emailResult) {
        throw new TRPCError({
          message: 'Error sending email',
          code: 'BAD_REQUEST',
        });
      }
  
      return true;
    }),

  validateSession: protectedProcedure
  .input(
    z.object({
      sessionToken: z.string()
    })
  )
  .mutation(async ({input})=>{

    const { sessionToken } = input
    
    const createSession = await Adapter.verificationAccessToken(sessionToken);

    if (!createSession) {
        throw new TRPCError({
          message: 'Error  Provider AcessToken',
          code: 'BAD_REQUEST',
      });
    }
      
    return createSession;
    
  }),
  authorized: protectedProcedure
  .query(async ({ ctx }) => {
    

    return {
          ...ctx
        };
  }),
  queryUser: protectedProcedure
  .query(async ({ ctx }) => {

      const { token } = ctx ;
  
      const { email } = parseToken(token) ;
  
      console.log(email);
      
      const userDate = await  Adapter.findUser(email);
  
      return userDate;
  }),

});

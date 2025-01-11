import { z } from 'zod';

import {
  Adapter,
  parseToken,
  validateToken,
} from '@neo/auth';
import { supabaseAdmin } from '@neo/supabase';
import { TRPCError } from '@trpc/server';

import {
  createTRPCRouter,
  protectedProcedure,
} from '../trpc';

export const Upload = createTRPCRouter({
  uploadTransactions: protectedProcedure
    .input(
      z.object({
        fileName: z.string().min(3, "File name must be at least 3 characters.").max(100, "File name must be at most 100 characters."),
        filePath: z.string().min(5, "File path must be at least 5 characters.").max(200, "File path must be at most 200 characters."),
        fileType: z.string().min(3, "File type must be at least 3 characters.").max(20, "File type must be at most 20 characters."),
        filesize: z.number().min(1, "File size must be greater than 0."),
        idFile: z.string().min(1, "ID file is required."),
        lastModified: z.string().optional(),
        lastModifiedDate: z.date().optional(),
        token: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const {
        fileName,
        filePath,
        fileType,
        filesize,
        idFile,
        lastModified,
        lastModifiedDate,
        token,
      } = input;

      if (!token || !validateToken(token)) {
        throw new TRPCError({
          message: 'Invalid token: ' + ctx.token + " token used: " + token,
          code: 'UNAUTHORIZED',
        });
      }

      const user = parseToken(token);
      const userId = user?.userId || "";
      const domain = user?.email || "";

      const domains = await Adapter.queryCompany({domain});
 
      const domainBucket = domains?.externalId;
      
      if (!domainBucket) {
        throw new TRPCError({
          message: 'This company Dont Provider Domain',
          code: 'BAD_REQUEST',
        });
      }

      if (!fileType) {
        throw new TRPCError({
          message: 'File type is required',
          code: 'BAD_REQUEST',
        });
      }

      const existFile = await Adapter.findFileName(fileName);

      if(!existFile){

         const createUpload = await Adapter.createUpload({ 
          fileName, 
          filePath, 
          fileType, 
          filesize, 
          idFile, 
          userId, 
          lastModified, 
          lastModifiedDate 
        });

        if (!createUpload) {
            throw new TRPCError({
            message: `This file already exists ${existFile}  este uploadd ${createUpload}`,
            code: 'BAD_REQUEST',
          });
        }

      }

      const path = filePath.split("/");

      const { data: bucketData, error: bucketError } = await supabaseAdmin.storage.getBucket(domainBucket);


      if (bucketError) {

        const { data, error } = await supabaseAdmin.storage.createBucket(domainBucket, { public: false });

        if (error) {
          throw new TRPCError({
            message: 'Error creating Bucket',
            code: 'INTERNAL_SERVER_ERROR',
          });
        }
        
      }

            
      if(!existFile){

          const checkFileExists = async (bucketName: string, filePath: string) => {
            const { data, error } = await supabaseAdmin.storage
              .from(bucketName)
              .list(filePath);

            if (error) {
              throw new TRPCError({
                message: 'Error checking file existence',
                code: 'INTERNAL_SERVER_ERROR',
              });
            }

            return data.some(item => item.name === filePath);
          };

          const fileExists = await checkFileExists(domainBucket, `${path[1]}/${fileName}`);


          if (fileExists ) {
            throw new TRPCError({
              message: `This file already exists: ${path[0]}/${path[1]}/${fileName}`,
              code: 'BAD_REQUEST',
            });
          }
      }

      return { success: true, message: 'File uploaded successfully'};

    }),
   AllTransactions :protectedProcedure
   .query(async({ctx})=>{

      const token = ctx.token;

      const { userId } = parseToken(token);
    
      if(!userId){
        throw new TRPCError({
          message: `Erro provider userId`,
          code: 'BAD_REQUEST',
        });
      }

      const  date = await Adapter.getAllTransactions({userId});

      if(!date){
        throw new TRPCError({
          message: `Erro provider transactions: ${date}`,
          code: 'BAD_REQUEST',
        });
      }
      
      return date

   }),
   queryFiles :protectedProcedure
    .query(async({ctx})=>{

        const token = ctx.token;

        const { userId } = parseToken(token);
        
        if(!userId){
          throw new TRPCError({
            message: `Erro provider userId`,
            code: 'BAD_REQUEST',
          });
        }

        const  date = await Adapter.getAllFiles({userId});

        if(!date){
          throw new TRPCError({
            message: `Erro provider Files: ${date}`,
            code: 'BAD_REQUEST',
          });
        }

      return date
      
   }),

   getUrlFiles :protectedProcedure
   .input(
    z.object({
      bucket:z.string(),
      folders:z.string()
    })
   )
   .mutation(async({input})=>{

      const { bucket , folders} = input;
      
      console.log({ bucket , folders});

      const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .createSignedUrl(folders, 60);

      if (error) {
        throw new TRPCError({
          message: `Erro ao obter a URL assinada: ${error.message}`,
          code: 'BAD_REQUEST',
        });
      }
  
      return data;
   })
});


//trnasactions
//file 

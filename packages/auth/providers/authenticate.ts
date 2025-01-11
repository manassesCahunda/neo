import { v4 as uuidv4 } from 'uuid';

import { generateHash } from '@neo/bcrypt';
import {
  db,
  eq,
} from '@neo/drizzle';
import {
  companies,
  files,
  session,
  teams,
  transactions,
  user,
  verificationToken,
  webhooks,
} from '@neo/drizzle/schemas';

export const Adapter = {

  /**
   * Creates a new company in the database.
   * @param companyData - The data of the company to create.
   * @returns The created company or throws an error if it already exists.
   */
  
  async createCompany(companyData: { name: string; domain: string }) {  
  
    const [, emailDomain] = companyData.domain.split('@');

    const existingCompany = await db.query.companies.findFirst({
      where(fields, { eq }) {
        return eq(fields.externalId, emailDomain);
      },
    });

    if (existingCompany) {
      throw new Error('Domain is already in use.');
    }

    const company = await db
      .insert(companies)
      .values({
        ...companyData,
      })
      .returning();

    if (!company) {
      throw new Error('Database connection error.');
    }

    return company || null;
  },



  /**
   * Creates a new user associated with a company.
   * @param userData - The data of the user to create.
   * @returns The created user or throws an error if it already exists or if the company is not registered.
   */
  async createUser(userData: { name: string; email: string; companyId: string; passwordHash: string; role: string }) {
  
    const userId = uuidv4();


    const company = await db.query.companies.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, userData.companyId);
      },
    });

    if (!company) {
      throw new Error('Domain not registered.');
    }


    const existingUser = await db.query.user.findFirst({
      where(user, { eq }) {
        return eq(user.email, userData.email);
      },
    });
  
    if (existingUser) {
      throw new Error('This user already exists in the system.');
    }


    userData.passwordHash = await generateHash(userData.passwordHash);


    const users = await db
      .insert(user)
      .values({
        ...userData,
        id: userId,
        emailVerified: new Date(), 
      })
      .returning();

    if (!users) {
      throw new Error('Database connection error.');
    }

    return {
      name: userData.name,
      email: userData.email,
      userId: userId,
      role: userData.role,
    } || null;
  },


  /**
   * Creates an access token for a user.
   * @param accessToken - The token to be created.
   * @param status - The status of the token.
   * @param idToken - The ID token associated with the user.
   * @returns The created access token.
   */

  async createAccessToken(acessToken: string,status:boolean,idToken: string): Promise<any> {
    const accessToken = await db
      .insert(verificationToken)
      .values({
        acessToken,
        status,
        idToken,
        id: uuidv4(),
      })
      .returning();

    if (!accessToken) {
      throw new Error('Database connection error.');
    }
    
    return accessToken;
  },




  /**
   * Finds a user by their email address.
   * @param email - The email address of the user to find.
   * @returns The found user or throws an error if the user does not exist.
   */
  async findUserByEmail(email: string) {
    const users = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        passwordHash: user.passwordHash,
      })
      .from(user)
      .where(eq(user.email, email))
      .limit(1)
      .execute();
  
    if (!users || users.length === 0) {
      throw new Error('This user does not exist.');
    }

    return users[0] ?? null;
  },



/**
   * Creates a session token and refresh token for a user.
   * @param token - The token to be created.
   * @param refreshToken - The refresh token to be created.
   * @param idToken - The ID token associated with the user.
   * @param userId - The ID of the user.
   * @param tokenType - The type of token.
   * @returns The created session information.
   */

    async createSession(token:string,refreshToken:string,idToken:string,userId:string,tokenType:string): Promise<any>  {

      const createSession = await db
        .insert(session)
        .values({
          idToken,
          token,
          userId,
          tokenType,
          refreshToken
        })
        .returning();
  
      if (!createSession) {
        throw new Error('Database connection error.');
      }
        
      return createSession;
    },

    async verificationAccessToken(sessionToken: string): Promise<any> {
      const existingSessionToken = await db.query.verificationToken.findFirst({
        where(fields, { eq }) {
          return eq(fields.acessToken, sessionToken);
        },
      });
    
      if (!existingSessionToken) {
        throw new Error('Session token is invalid or does not exist.');
      }
    
      if (existingSessionToken.status !== false) {
        throw new Error('Token status must be false to proceed.');
      }
      
      const userSessionToken = await db
        .select({
          token: session.token,
          refreshToken: session.refreshToken,
        })
        .from(user)
        .innerJoin(session, eq(user.id, session.userId)) 
        .where(eq(session.idToken, existingSessionToken.idToken))
        .limit(1)
        .execute();
    
      if (!userSessionToken || userSessionToken.length === 0) {
        throw new Error('This user does not exist or has no associated sessions.');
      }

          
      await db.update(verificationToken)
        .set({ status: true }) 
        .where(eq(verificationToken.acessToken, sessionToken)); 
    
    
      return userSessionToken[0] ?? null;
    },

    async queryCompany(companyData: { domain: string }) {  
  
      const [, emailDomain] = companyData.domain.split('@');
  
      const [nameDomain, ] = emailDomain.split('.') ;

      const existingCompany = await db.query.companies.findFirst({
        where(fields, { eq }) {
          return eq(fields.externalId, nameDomain);
        },
      });
  
      if (!existingCompany) {
        throw new Error('The domain does not exist in use.'+nameDomain);
      }

      return existingCompany ?? null;
    },

    async createTeams(companyData: { name: string , domain:string , amount:string}) {  
  
      const { amount , domain , name } = companyData

      const [, emailDomain] = domain.split('@');

      const [nameDomain,] = emailDomain.split('.');

      const existingCompany = await db.query.companies.findFirst({
        where(fields, { eq }) {
          return eq(fields.name, nameDomain);
        },
      });
  
      if (!existingCompany) {
        throw new Error('The domain does not exist in use.');
      }

      const companyId = existingCompany.id || null;

      
      const createTeams = await db
        .insert(teams)
        .values({
          id:uuidv4(),
          companyId,
          name,
          amount
        })
        .returning();
  
      if (!createTeams) {
        throw new Error('Erro de create Teams.');
      }
        

      return createTeams;

    },
      /**
    * @param companyDate - The ID of the user.
     */

      async getTeams(companyDate:{domain:string}){
      
        const { domain } = companyDate;
  
        const [, emailDomain] = domain.split('@');
  
        const [nameDomain,] = emailDomain.split('.') || "";
  
        const existingCompany = await db.query.companies.findFirst({
          where(fields, { eq }) {
            return eq(fields.name, nameDomain);
          },
        });
    
        if (!existingCompany) {
          throw new Error('The domain does not exist in use.');
        }
  
        const companyId = existingCompany.id;
  
        const existingTeams = await db.query.teams.findFirst({
          where(fields, { eq }) {
            return eq(fields.companyId, companyId);
          },
        });
  
        return existingTeams || null;
  
      },


        /**
   * Creates a new company in the database.
   * @param fileDetails - The data of the company to create.
   * @returns The created company or throws an error if it already exists.
   */
      
     async createUpload(fileDetails: {
          fileName: string;
          filePath: string;
          fileType: string;
          filesize: number;
          idFile: string;
          userId: string;
          lastModified?: any;
          lastModifiedDate?:any
        }) {
          const { fileName, filePath, fileType, filesize, idFile, userId, lastModified , lastModifiedDate } = fileDetails;
        
          const existingFile = await db.query.files.findFirst({
            where: eq(files.fileName, fileName),
          });
        
          if (existingFile) {
            throw new Error('This file already exists');
          }
        
          const fileUpload = await db.insert(files).values({
            fileName,
            filePath,
            fileType,
            filesize,
            idFile,
            userId,
            lastModified,
            lastModifiedDate: lastModifiedDate ?  new Date(lastModifiedDate)  : undefined
          });
        
          if (!fileUpload) {
            throw new Error('Failed to upload file');
          }
        
          return { success: true, message: 'File uploaded successfully', file: fileUpload };
     } ,

    
    /**
     * @param transactionsDetails - The data of the company to create.
     * @returns The created company or throws an error if it already exists.
     */

    async createTransactions(transactionsDetails: {
        userId?:string,
        idFile?:string,
        companyName?: string;
        entity?: string;
        identify?: string;
        details?: string;
        dateInvoice?: string;
        expiryDate?: string;
        typeInvoice?: string;
        unitPrice?: {};
        amount?: {};
        total?: {};
        totalIva?: {};
        balanceTotal?:{};
      }) {


        const  {
          companyName,
          entity,
          idFile,
          identify,
          details,
          dateInvoice,
          expiryDate,
          typeInvoice,
          unitPrice,
          amount,
          total,
          totalIva,
          balanceTotal,
          userId
        } = transactionsDetails;



        const existingFile = await db.query.transactions.findFirst({
          where: eq(transactions.identify, identify),
        });
      
        if (existingFile) {
          throw new Error('This Transactions already exists');
        }

        const transactionUpload = await db.insert(transactions).values({
            id:uuidv4(),
            companyName,
            entity,
            identify,
            details,
            dateInvoice,
            expiryDate,
            typeInvoice,
            unitPrice,
            amount,
            total,
            totalIva,
            balanceTotal,
            userId,
            idFile
          })
          .returning();

        if (!transactionUpload) {
          throw new Error('Failed to create transaction');
        }

        return { success: true, message: 'Transaction created successfully', transaction: transactionUpload };
    }
    ,
        /**
       * Retrieves a webhook for a user.
       * @param Webhook - The parameters for the webhook.
       * @returns The found webhook object.
       */
        async getWebhook(Webhook: { userId?: string }): Promise<any> {
          const { userId } = Webhook;
        
          if (!userId) {
            throw new Error('userId must be provided.');
          }
        
           const getAll = await db.select({
              name: webhooks.name,
              id: webhooks.id,
              url: webhooks.url,
              eventType: webhooks.eventType,
              channels: webhooks.channels,
              userId: webhooks.userId
            })
            .from(webhooks)
            .where(eq(webhooks.userId, userId))
            .execute();
        
          if (getAll.length === 0) {
            throw new Error('No webhooks found for the provided userId.');
          }
        
          return getAll;
        } ,
        /**
           * Retrieves all transactions for a user along with file data.
           * @param getAllTransactions - The parameters for retrieving transactions and files.
           * @returns An object containing the transactions and their associated file data.
           */

        async getAllTransactions(getAllTransactions: { userId?: string, Idcompany?: string }) {
          const { userId, Idcompany } = getAllTransactions;
      
          if (!userId && !Idcompany) {
              throw new Error('Either userId or Idcompany must be provided.');
          }
      
          let company;
          if (userId) {
              company = await db
                  .select({ companyId: user.companyId })
                  .from(user)
                  .where(eq(user.id, userId))
                  .limit(1)
                  .execute();
          }
      
          const companyId = company && company[0]?.companyId ? company[0].companyId : Idcompany;
      
          console.log("Company ID:", companyId);
      
          if (!companyId) {
              throw new Error('User not found or companyId is undefined.');
          }
      
          const usersInCompany = await db.query.user.findMany({
              where: eq(user.companyId, companyId),
          });
      
          console.log("Users in company:", usersInCompany);
      
          if (usersInCompany.length === 0) {
              throw new Error('No users found for the provided companyId.');
          }
      
          const allTransactions = [];
          for (const user of usersInCompany) {

              console.log("User ID:", user.id);
      
              const transaction = await db.query.transactions.findMany({
                  where: eq(transactions.userId, user.id),
              });
    
              console.log("Transactions for user:", transaction);
      
              allTransactions.push(...transaction);
          }
      
          if (allTransactions.length === 0) {
              throw new Error('No transactions found for the users in this company.');
          }
      
          return allTransactions;
      }
,        
   async getUserTransactions(getAllTransactions:{ userId:any }) {

        const { userId } = getAllTransactions;

  
        const getTransactions = await db.query.transactions.findMany({
          where: eq(transactions.userId, userId)
        })
    
        if (getTransactions.length === 0) {
            throw new Error('No transactions found for the provided userId.');
        };
    
        return getTransactions;
    }


    ,


          /**
           * Retrieves all transactions for a user along with file data.
           * @param getAllFiles - The parameters for retrieving transactions and files.
           * @returns An object containing the transactions and their associated file data.
           */

          async getAllFiles(getAllFiles:{ userId:string }) {

              const { userId } = getAllFiles;
    
              const company = await db
                  .select({
                      companyId: user.companyId,
                  })
                  .from(user)
                  .where(eq(user.id, userId))
                  .limit(1)
                  .execute();
          
              if (!company.length) {
                  throw new Error('User not found.');
              }
          
              const companyId = company[0].companyId;
          
              const usersInCompany = await db.query.user.findMany({
                  where: eq(user.companyId, companyId),
              });
          
              if (usersInCompany.length === 0) {
                  throw new Error('No users found for the provided companyId.');
              }
          
    
              const AllFiles = [];
          
              for (const user of usersInCompany) {
                  const file = await db.query.files.findMany({
                      where: eq(files.userId, user.id), 
                  });
          
                  AllFiles.push(...file);
              }
          
              if (AllFiles.length === 0) {
                  throw new Error('No transactions found for the users in this company.');
              }
          
            return AllFiles;
        },


        async findUser(email: string) {
          const users = await db
            .select({
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              image:user.image
            })
            .from(user)
            .where(eq(user.email, email))
            .limit(1)
            .execute();
        
          if (!users || users.length === 0) {
            throw new Error('This user does not exist');
          }
      
          return users[0] ?? null;
        },

        async getAllWebhooks(userId:any) {
  
          const get = await db.query.webhooks.findMany({
            where: eq(webhooks.userId, userId)
          })
      
          if (!get) {
              throw new Error('Erro Provider Webhooks.');
          };
      
          return get;
         } ,
         async createWebhooks({
          name,
          url,
          channels,
          eventType,
          status,
          userId
        }: {
          name: string;
          url: string;
          channels: string;
          eventType: string;
          status: boolean;
          userId: string;
        }) {

          if (!name || !url || !channels || !eventType || status === undefined) {
            throw new Error(`Error Provider Date`);
          }
            const result = await db.insert(webhooks).values({
              id:uuidv4(),
              name,
              url,
              channels,
              eventType,
              status,
              userId,
            }).execute();
        
            if (!result) {
              throw new Error(`Error creating webhook: ${result}`);
            }
        
            return result;

        },
        async updateUser(
          email: string,
          updatedData: { 
            email?: string; 
            name?: string; 
            role?: string; 
            image?: string; 
            passwordHash?: string; 
          }
        ) {

          if (updatedData.passwordHash === undefined || updatedData.passwordHash === null || updatedData.passwordHash === "") {
            delete updatedData.passwordHash; 
          }

          const users = await db.update(user).set(updatedData).where(eq(user.email, email))
        
          if (!users) {
              throw new Error('This user does not exist or update failed');
          }
        
          return users[0] ?? null;
        },
        
        async getAllUser(companyId: string) {

          const company = await db
            .select({
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              image:user.image
            })
            .from(user)
            .where(eq(user.companyId, companyId))
            .execute();
        
          if (!company || company.length === 0) {
            throw new Error('This user does not exist');
          }
      
          return company ?? null;
      },

      async updateCompany(companyDate:{
        id?: string,
        domain?: string,
        name?: string,
        host?: string,
        key?: string,
        xauth?: string,
        externalId:string,
      }) {

        const {id ,domain , name ,host ,key ,xauth , externalId} = companyDate;

        
        if((id === undefined || id === null) && 
          (domain === undefined || domain === null) && 
          (name === undefined || name === null)) {
          throw new Error('Missing required parameters: id, domain, or name');
        }
      
        if ((host === undefined || host === null) && 
            (key === undefined || key === null) && 
            (xauth === undefined || xauth === null)) {
            throw new Error('Missing required external API key information: host, key, or xauth');
          }

          const externalApiKey = {
            email:domain,
            host: host ?? "",  
            key: key ?? "",   
            xauth: xauth ?? "" 
          };
      
        try {

          console.log({ domain, name, externalApiKey ,externalId});

          const updatedCompany = await db.update(companies)
            .set({externalId,domain, name, externalApiKey })
            .where(eq(companies.id, id));
      
          if (!updatedCompany) {
            throw new Error(`Company with id ${id} not found or update failed`);
          }
      
          return updatedCompany ?? null;
        } catch (error) {

          console.error('Error updating company:', error);
          throw new Error(`Error updating company: ${error.message}`);
        }
      }
   ,
   async getAllCompany() {
        const company = await db
          .select({
            externalApiKey: companies.externalApiKey,
            domain:companies.domain
          })
          .from(companies)
          .execute();
      
        if (!company || company.length === 0) {
          throw new Error('This user does not exist');
        }
        return company ?? null;
    },
      async findFileName(fileName: string) {

        const Files  = await db
          .select({
            idFile: files.idFile,
          })
          .from(files)
          .where(eq(files.fileName, fileName))
          .limit(1)
          .execute();

          if (Files.length === 0) {
            return false;
          }
        
          const fileId = Files[0]?.idFile;
        
          const Transactions = await db.query.transactions.findMany({
            where: eq(transactions.idFile, fileId),
          });
        
          if (!Transactions) {
            throw new Error('No transactions found for the file');
          }

        return Transactions.length === 0  ? true : false;
    },
    async  updateExternalApiKey(
      email: string,
      host?: string,
      key?: string,
      connect?:boolean
    ) {
      if (!email) {
        throw new Error('Email is required to update the external API key.');
      }
    
      const externalApiKey = {
        email: email ?? "",
        host: host ?? "",
        key: key ?? "",
        xauth: "default",
        connect: connect ?? null,
      };
    
      try {

        const company = await db
          .select({ id: companies.id })
          .from(companies)
          .where(eq(companies.domain, email))
          .limit(1)
          .execute();
    
        if (!company || company.length === 0) {
          throw new Error(`Company with email "${email}" does not exist.`);
        }

        const updateResult = await db
          .update(companies)
          .set({ externalApiKey })
          .where(eq(companies.id, company[0].id))
          .execute();
    
        if (!updateResult) {
          throw new Error('Failed to update the external API key.');
        }

        const updatedCompany = await db
          .select()
          .from(companies)
          .where(eq(companies.id, company[0].id))
          .execute();
    
        return updatedCompany?.[0] ?? null;
      } catch (error) {
        console.error('Error updating external API key:', error);
        throw new Error('An error occurred while updating the external API key.');
      }
    }    
  };



      
          // const getFiles = await db.select({
          //     fileName: files.id,
          //     filePath: files.filePath,
          //     fileType: files.fileType,
          //     filesize: files.filesize,
          //     idFile: files.idFile,
          //     userId: files.userId,
          //     lastModified: files.lastModified,
          //     lastModifiedDate: files.lastModifiedDate,
          //     createdAt: files.createdAt,
          //     updatedAt: files.updatedAt
          // })
          // .from(files) // Corrigido para buscar arquivos da tabela correta
          // .where(eq(files.userId, userId))
          // .execute(); // Removi .all() para usar .execute(), que é o método padrão
      
          // if (getFiles.length === 0) {
          //     throw new Error('No files found for the provided userId.');
          // }
      
          // const fileIds = getFiles.map(file => file.idFile);
      
          // const transactionConditions = fileIds.map(id => eq(transactions.idFile, id));
          // let whereCondition;
      
          // if (transactionConditions.length > 1) {
          //     whereCondition = or(...transactionConditions);
          // } else {
          //     whereCondition = transactionConditions[0];
          // }
      

          // const getUser = await db.select({
          //     id: user.id,
          //     name: user.name,
          //     email: user.email,
          //     role: user.role,
          // })
          // .from(user)
          // .where(eq(user.id, userId)) // Corrigido para buscar pelo id do usuário
          // .execute();
      
          // if (getUser.length === 0) {
          //     throw new Error('No User found for the provided userId.');
          // } async updateCompany(
    
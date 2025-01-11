import { MailListener } from 'mail-listener5';

const sinceDate = new Date();

sinceDate.setHours(0, 0, 0, 0); 

const sinceString = sinceDate.toUTCString().split(' ').slice(0, 4).join(' ');


export interface MailListenerProps {
    username: string; 
    password: string; 
    host: string; 
    port?: number;
    tls?: boolean;
    tlsOptions?: { rejectUnauthorized: boolean };
    mailbox?: string;
    searchFilter?: string[];
    markSeen?: boolean;
    fetchUnreadOnStart?: boolean;
    attachments?: boolean;
}

const configMail = (config: MailListenerProps): MailListenerProps => {
    return {
        ...config,
        port: config.port || 993,
        tls: config.tls !== undefined ? config.tls : true, 
        tlsOptions: config.tlsOptions || { rejectUnauthorized: false },
        mailbox: config.mailbox || 'INBOX', 
        searchFilter: ['UNSEEN', ['SINCE', sinceString]],
        markSeen: config.markSeen !== undefined ? config.markSeen : true, 
        fetchUnreadOnStart: config.fetchUnreadOnStart !== undefined ? config.fetchUnreadOnStart : true, 
        attachments:  true,
        mailParserOptions: { streamAttachments: true },
        attachmentOptions: { stream: "true" }
    };
};

export { configMail, MailListener };

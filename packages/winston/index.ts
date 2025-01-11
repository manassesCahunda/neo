import winston from "winston";

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'info.log',
      level: 'info',
    }),
    new winston.transports.File({
      filename: 'error.log',
      level: 'error',
    })
  ],
});

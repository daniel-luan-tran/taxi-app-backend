import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';

// Define which transports the logger must use to print out messages.
const transports = [
  // Send to console
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.ms(),
      nestWinstonModuleUtilities.format.nestLike('nest-api', {
        colors: true,
        prettyPrint: true,
      }),
    ),
  }),
  // Save to file
  new winston.transports.File({
    filename: 'logs/logs.json',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    ),
  }),
];

export const winstonLogger = winston.createLogger({
  level: 'info',
  transports,
});

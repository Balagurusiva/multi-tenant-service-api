import pino from 'pino';

const transport = process.env.NODE_ENV === 'production'
  ? pino.transport({
      target: 'pino/file',
      options: { destination: 'logs/app.log' }
    })
  : pino.transport({
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname'
      }
    });

export const logger = pino(
  {
    level: process.env.LOG_LEVEL || 'info',
    timestamp: pino.stdTimeFunctions.isoTime
  },
  transport
);

export default logger;

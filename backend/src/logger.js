import winston from 'winston';
import morgan from 'morgan';

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
    winston.format.printf((log) => `[${log.timestamp}] ${log.level}: ${log.message}`),
  ),
  transports: [
    new winston.transports.File({
      filename: 'app.log',
      maxsize: 1024,
      maxFiles: 1,
      tailable: true,
    }),
  ],
  exitOnError: false,
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console());
}

const requestLogger = morgan(
  (tokens, req) => {
    const query = Object.keys(req.query).length ? `PARAMS: ${JSON.stringify(req.query)}` : '';
    const hidePass = (k, v) => (k === 'password' ? '*****' : v);
    const body = Object.keys(req.body).length ? `BODY: ${JSON.stringify(req.body, hidePass)}` : '';
    return `${req.method}: ${req.originalUrl} ${query} ${body}`;
  },
  {
    stream: {
      write(message) {
        logger.info(message);
      },
    },
  },
);

export { requestLogger, logger };

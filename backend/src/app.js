import express from 'express';
import cors from 'cors';
import { logger, requestLogger } from './logger.js';
import transactionRouter from './resources/transactions/transaction.router.js';
import userRouter from './resources/users/user.router.js';
import checkAuthentication from './resources/utils/tokenCheck.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.options('*', cors());

app.use('/', (req, res, next) => {
  if (req.originalUrl === '/') {
    res.send('This is rest api service');
    return;
  }
  next();
});

app.use('/', checkAuthentication);
app.use('/transactions', transactionRouter);
app.use('/users', userRouter);

app.use((error, req, res, next) => {
  logger.error(`${error.message}`);
  res.status(500).send('Internal server error');
  next();
});

process.on('uncaughtException', (error) => {
  logger.error(`uncaughtException: ${error.message}`);
});

process.on('unhandledRejection', (reason) => {
  logger.error(`unhandledRejection: ${reason.message}`);
});

export default app;

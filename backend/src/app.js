import express from 'express';
import cors from 'cors';
import transactionRouter from './resources/transactions/transaction.router.js';

const app = express();
app.use(cors());
app.use(express.json());

app.options('*', cors());

app.use('/', (req, res, next) => {
  if (req.originalUrl === '/') {
    res.send('This is rest api service');
    return;
  }
  next();
});

app.use('/transactions', transactionRouter);

export default app;

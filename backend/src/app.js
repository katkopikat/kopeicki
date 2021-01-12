import express from 'express';
import cors from 'cors';
import transactionRouter from './resources/transactions/transaction.router.js';
import authRouter from './resources/routes/auth.js';
import checkAuthentication from './resources/utils/tokenCheck.js';
// import tokenRouter from './resources/routes/token.js';

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

app.use('/', checkAuthentication);
app.use('/transactions', transactionRouter);
app.use('/auth', authRouter);
// app.use('/tokens', tokenRouter);

export default app;

import 'dotenv/config.js';
import mongoose from 'mongoose';
import app from './app.js';
import { logger } from './logger.js';

mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const db = mongoose.connection;

db.on('error', () => logger.error('MongoDB connection error'));
db.once('open', () => {
  logger.info('connected to mongoDB');
  app.listen(process.env.PORT, () => logger.info(`App is running on http://localhost:${process.env.PORT}`));
});

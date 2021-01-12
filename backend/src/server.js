import 'dotenv/config.js';
import mongoose from 'mongoose';
import app from './app.js';

mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const db = mongoose.connection;

db.on('error', () => console.log('MongoDB connection error'));
db.once('open', () => {
  console.log('connected to mongoDB');
  app.listen(process.env.PORT, () => console.log(`App is running on http://localhost:${process.env.PORT}`));
});

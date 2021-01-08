import mongoose from 'mongoose';
import app from './app.js';

const PORT = 8000;
const MONGO_CONNECTION_STRING = 'mongodb+srv://admin:7FITZQDF5qpnQbRS@rscluster.msaso.mongodb.net/rsclone?retryWrites=true&w=majority';

mongoose.connect(MONGO_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const db = mongoose.connection;

db.on('error', () => console.log('MongoDB connection error'));
db.once('open', () => {
  console.log('connected to mongoDB');
  app.listen(PORT, () => console.log(`App is running on http://localhost:${PORT}`));
});

import mongoose from 'mongoose';

const UserProfile = new mongoose.Schema({
  accounts: [{
    name: String,
    amount: Number,
    currency: String,
    icon: String,
  }],
  expenses: [{
    name: String,
    icon: String,
  }],
  income: [{
    name: String,
    icon: String,
  }],
  currency: String,
  lang: String,
});

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
);
UserSchema.add(UserProfile);

const User = mongoose.model('User', UserSchema);
const UserTemplate = mongoose.model('UserTemplate', UserProfile);

export { User, UserTemplate };

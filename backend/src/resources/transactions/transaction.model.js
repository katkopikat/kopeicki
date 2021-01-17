import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema(
  {
    date: Date,
    user: String,
    account: String, // wallet, bank, etc
    amount: Number,
    category: String, // transport, cafe, etc
    type: String, // expense || income
    description: String,
  },
  { toJSON: { virtuals: true, useProjection: true } },
);

export default mongoose.model('Transaction', TransactionSchema);

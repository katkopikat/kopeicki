import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema(
  {
    date: { type: Date, default: Date.now },
    user: String,
    purse: String,
    amount: Number,
    category: String,
    description: String,
  },
  { toJSON: { virtuals: true, useProjection: true } },
);

export default mongoose.model('Transaction', TransactionSchema);

import mongoose from 'mongoose';

const TokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    expire: {
      type: Number,
      required: true,
    },
  },
);

export default mongoose.model('token', TokenSchema);

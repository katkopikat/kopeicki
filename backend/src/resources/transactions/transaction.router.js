import Router from 'express';
import asyncHandler from 'express-async-handler';
import Transaction from './transaction.model.js';
import { updateAccount } from '../users/user.service.js';

const router = Router({ mergeParams: true });

router.route('/').get(
  asyncHandler(async (req, res) => {
    const findParams = {
      user: res.locals.userId,
    };
    const txs = await Transaction.find(findParams)
      .sort({ date: -1, _id: -1 }) // desc
      .exec();
    res.json(txs);
  }),
);

router.route('/').post(
  asyncHandler(async (req, res) => {
    const tx = await Transaction.create(req.body);
    await updateAccount(tx);
    res.json(tx);
  }),
);

router.route('/:id').get(
  asyncHandler(async (req, res) => {
    const tx = await Transaction.findById(req.params.id).exec();
    if (tx) {
      res.json(tx);
    } else {
      res.sendStatus(404);
    }
  }),
);

router.route('/:id').put(
  asyncHandler(async (req, res) => {
    const tx = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }, // return updated document
    ).exec();
    res.json(tx);
  }),
);

router.route('/:id').delete(
  asyncHandler(async (req, res) => {
    const deletedTxId = await Transaction.findByIdAndDelete(req.params.id).exec();
    if (deletedTxId) {
      res.json(req.params.id);
    } else {
      res.sendStatus(404);
    }
  }),
);

export default router;

import Router from 'express';
import asyncHandler from 'express-async-handler';
import Transaction from './transaction.model.js';
import { updateAccount } from '../users/user.service.js';
import statPipeline from './transaction.db.js';

const router = Router({ mergeParams: true });

router.route('/statistics').get(
  asyncHandler(async (req, res) => {
    const stat = await Transaction.aggregate(statPipeline(res.locals.userId));
    res.json(stat[0]);
  }),
);

router.route('/')
  .get(
    asyncHandler(async (req, res) => {
      const findParams = {
        user: res.locals.userId,
      };
      const txs = await Transaction.find(findParams)
        .sort({ date: -1, _id: -1 }) // desc
        .exec();
      res.json(txs);
    }),
  )
  .post(
    asyncHandler(async (req, res) => {
      const tx = await Transaction.create(req.body);
      await updateAccount(tx);
      res.json(tx);
    }),
  );

router.route('/:id')
  .get(
    asyncHandler(async (req, res) => {
      const tx = await Transaction.findById(req.params.id).exec();
      if (tx) {
        res.json(tx);
      } else {
        res.sendStatus(404);
      }
    }),
  )
  .put(
    asyncHandler(async (req, res) => {
      const tx = await Transaction.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }, // return updated document
      ).exec();
      res.json(tx);
    }),
  )
  .delete(
    asyncHandler(async (req, res) => {
      const deletedTx = await Transaction.findByIdAndDelete(req.params.id).exec();
      if (deletedTx) {
        deletedTx.amount = -deletedTx.amount;
        await updateAccount(deletedTx);
        res.json(req.params.id);
      } else {
        res.sendStatus(404);
      }
    }),
  );

export default router;

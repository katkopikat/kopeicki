import Router from 'express';
import asyncHandler from 'express-async-handler';
import Transaction from './transaction.model.js';

const router = Router({ mergeParams: true });

router.route('/').get(
  asyncHandler(async (req, res) => {
    const txs = await Transaction.find({}).exec();
    res.json(txs);
  }),
);

router.route('/').post(
  asyncHandler(async (req, res) => {
    const tx = await Transaction.create({
      date: req.body.date,
      user: req.body.user,
      purse: req.body.purse,
      amount: req.body.amount,
      category: req.body.category,
      description: req.body.description,
    });
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
      {
        date: req.body.date,
        user: req.body.user,
        purse: req.body.purse,
        amount: req.body.amount,
        category: req.body.category,
        description: req.body.description,
      },
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

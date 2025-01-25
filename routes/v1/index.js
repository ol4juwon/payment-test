'use strict';
// eslint-disable-next-line new-cap
const router = require('express').Router();
const authRouter = require('./auth');
const userRouter = require('./user');
const transactionsRouter = require('./transactions');
const paymentsRouter = require('./payment');
const {validateUser} = require("../../app/Middleware");

router.use('/auth', authRouter);
router.use('/payments', paymentsRouter);
router.use(validateUser)
router.use("/transactions", transactionsRouter);
router.use('/users', userRouter);


module.exports = router;

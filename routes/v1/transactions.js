'use strict';
// eslint-disable-next-line new-cap
const router = require('express').Router();
const transactionController = require('../../app/v1/transaction/transactions.controller');
const {validateUser} = require("../../app/Middleware");
router.use(validateUser)
router.get('/:user_id',transactionController.getUserTransactions);
router.get("/", transactionController.getAllTransactions);
module.exports = router;

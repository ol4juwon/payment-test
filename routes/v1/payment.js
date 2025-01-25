'use strict';
// eslint-disable-next-line new-cap
const router = require('express').Router();

const paymentController = require('../../app/v1/payment/payment.controllers');

const paymentValidator = require('../../app/v1/payment/payment.validator');
const {validateUser} = require("../../app/Middleware");
router.get('/verify', paymentController.verify);
router.use(validateUser)
router.post('/charge', paymentValidator.charge, paymentController.chargeCardAuth);
router.post('/init', paymentValidator.init, paymentController.chargeInit);
module.exports = router;

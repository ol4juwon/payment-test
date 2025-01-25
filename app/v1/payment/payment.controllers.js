/* eslint-disable camelcase */
'use strict';
const paymentService = require('./payment.service');

exports.chargeInit = async (req, res) => {
    const payload = req.body;
    if(!req.user_id){
        logger.error("Charge card Init Error")
        return createErrorResponse(res, 'You cannot perform this operation', ["User_id invalid"], 403);
    }
    payload.user_id = req.user_id;
    const {error, data} = await paymentService.chargeInit(payload);
    if (error) {
        logger.error("Charge Init Error", error?.data)
        return createErrorResponse(res, 'error charging card', [error], 400);
    }
    return createSuccessResponse(res, 'Charge successful', data.data, 200);
}
exports.chargeCardAuth = async (req, res) => {
    const payload = req.body;
    const {error, data} = await paymentService.chargeCardAuth(req.user_id, payload);
    if (error) {
        logger.error("Charge Card Error", error)
        return createErrorResponse(res, 'error charging card', error, 400);

    }
    return createSuccessResponse(res, 'Charge successful', data, 200);
}

exports.verify = async (req, res) => {

    logger.info("Verify", req.query);
    const {trxref, reference, ab} = req.query;
    const {error, data} = await paymentService.verify(trxref, reference, ab);
    if (error) return createErrorResponse(res, 'Error verifying transaction', error, 400);
    return createSuccessResponse(res, 'Verification successful', data.data, 200);
}
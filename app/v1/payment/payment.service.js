/* eslint-disable camelcase */
'use strict';
const paystackService = require('../../../services/paystack.service');
const paymentModel = require('./payment.model');
const cards = require('./cards.model')
const userModel = require('../users/users.model');
const nanoid = require("nanoid").customAlphabet("123456789", 10);
/**
 *
 * Initialize card transactions
 * @param payload
 * @returns {Promise<{error}|{data, error}|{error: string}>}
 */
exports.chargeInit = async (payload) => {
    try {
        const user = await userModel.findById(payload.user_id);
        if(!user)
            return {
            error: "Invalid user"
            }
        const ref = `Alv-init-${nanoid()}`;
        payload.trx_ref = ref;
        payload.meta.trx_ref = ref;
        payload.meta.user_id = payload.user_id;
        const addPending = await paymentModel(payload);
        addPending.save().catch(e => console.log(e));
        logger.info('Pending', addPending);
        payload.user_id = payload.meta.user_id;
        const {error, data} = await paystackService.cardInit(payload);
        return {error, data}

    } catch (e) {
        return {error: e}
    }
}
/**
 * Charge Card auth with cardId
 * @param user_id
 * @param cardId
 * @param amount
 * @param reason
 * @returns {Promise<{data: {reference: *, amount: *, metadata: *}}|{error}|{error: string}>}
 */
exports.chargeCardAuth = async (user_id, {cardId, amount, reason}) => {
    try {
        logger.info({cardId, amount, user_id})
        const user = await userModel.findById(user_id);
        if(!user){
            return {error: "User not found"}
        }
        const card = await cards.findOne({user_id});
        if(!card){
            return {error: "Card not found"}
        }
        const ref = `Alv-charge-${nanoid()}`;
        const payload = {trx_ref:ref, amount ,cardAuth: card.cardAuth  }
        // payload.trx_ref = ref;
        logger.info({payload});
        payload.meta = {}
        payload.channel = "card"
        payload.user_id = user_id
        payload.email = user.email
        payload.meta.user_id = user_id
        payload.meta.reason =reason
        payload.meta.trx_ref = ref;

        const addPending = await paymentModel(payload);
        addPending.save().catch(e => logger.error(e));
        // console.log('Pending', addPending);
        payload.user_id = payload.meta.user_id;
        const {error, data} = await paystackService.chargeToken(payload);
        // console.log(data);
        if (data) {
            logger.info('paid', data.data)
            if (data.data.data.status === "success") {
                const addBalance =
                    await userModel.findOneAndUpdate({_id: data.data.data.metadata.user_id},
                        {$inc: {balance: parseInt(data.data.data.amount) / 100}}, {new: true}).then((res) => res).catch(err => err);


                logger.info("addin", addBalance);
                addPending.status = "success";
                await addPending.save();
                delete addBalance.avatar;
                // data.data = addBalance;
            } logger.info('paid2', data.data.data)
            return {data: {amount: data.data.data.amount,reference: data.data.data.reference, metadata:data.data.data.metadata }}
        }
        // data.data.avatar = undefined;
        return {error:  error.message}

    } catch (e) {
        logger.error("Error", e)
        return {error: e.message}
    }
}

/**
 * Verify transactions
 * @param trxref
 * @param reference
 * @param ab
 * @returns {Promise<{error}|{data: {data: Document<any, any, unknown> & {}, status: string}}|{error: *}|{error: string}|{error: {message: string, transaction: Document<any, any, unknown> & {}}}|{data: {status}}>}
 */
exports.verify = async (trxref, reference, ab) => {
    try {
        const payload = {trxref, reference};
        const transaction = await paymentModel.findOne({trx_ref: trxref}).then(res =>res);
        if(!transaction){
            return {error: "transaction not found"}
        }
        if(transaction.status === "success" || transaction.status === "failed" ){
            return {error: {message: "transaction already processed", transaction}}
        }
        logger.info({transaction})
        const {error, data} = await paystackService.verifyTransaction(payload);
        // console.log(error, data);
        if (error) {
            logger.error({error: JSON.stringify(error)})
            return {error}
        }
        console.log({data})
        if (data.status === 'success') {
            logger.info('success data', data.metadata)
            const user = await userModel.findById(data.metadata.user_id);
            logger.info('user', user);
            if (user && !ab) {
                const addBalance =
                    await userModel.findOneAndUpdate({_id: data.metadata.user_id},
                        {$inc: {balance: data.amount / 100}}, {new: true}).then((res) => res).catch(err => err);
                logger.info('adding balance', addBalance);
                if (addBalance) {
                    const findCard = await cards.findOne({
                        user_id: data.metadata.user_id,
                        cardAuth: data.authorization.authorization_code
                    });
                    logger.info(findCard);
                    if (!findCard) {
                        const cardAdded = await cards({
                            cardAuth: data.authorization.authorization_code,
                            user_id: data.metadata.user_id,
                            cardSig: data.authorization.signature,
                            last4: data.authorization.last4,
                            bank: data.authorization.bank,
                        })
                        cardAdded.save();

                    }

                }
                transaction.status = 'success';
                await  transaction.save();
                return {data: {status: 'success', data: addBalance}}
            }
            return {data: {status: data.status}}
        }

    } catch (e) {
        return {error: e}
    }
}

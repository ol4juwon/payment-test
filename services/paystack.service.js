
var axios = require("axios");
const secKey = process.env.PAYSTACK_SECRET_KEY;

class PaystacksService {
    constructor(){
        this._axios = axios.create({
            baseURL: "https://api.paystack.co",
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${secKey}`,
                'Content-Type': 'application/json',
                'cache-control': 'no-cache'

            }
        });
        this.email = "olajuwonlawal2012@gmail.com";
    }
    async cardInit(payload) {
        try {
            logger.info("Email", payload.email);
            logger.info("Amount", payload.amount);
            logger.info("RedirectUrl", payload.callback_url);
            const body  =  {
                amount: payload.amount * 100,
                reference: payload.trx_ref,
                channels: ['card'],
                email: payload.email || this.email,
                metadata: payload.meta,
                callback_url: payload.callback_url || `https://localhost:4002/api/v1/payment/verify`
            };
            const response = await this._axios
                .post(`/transaction/initialize`,body);
            logger.info("pss", response.data);
            return {
                status: response.data.status,
                data:response.data};
        } catch (e) {
            logger.error("catch ",e.response);
            return {status: false, error: e.response.data};
            // throw new CustomPaystackError(e);
        }
    }

    async chargeMomo(payload){

        try{
            logger.info("payload", payload);
            const response = await this._axios.post(`/transaction/charge_authorization`, );

        }catch(e){
            logger.error(e.response.data);
            return {
                status: false,
                error: e.response.data};
        }
    }
    async verifyTransaction(payload) {
   
        try {
            logger.info("payload", payload.reference);
            return await this._axios
                .get(`/transaction/verify/${payload.trxref}`)
                .then(data =>{
                    logger.info("Verification Successful",data.data.data.status)
                    if(data.data.data.status !== 'success'){
                        return {status:false, error: data.data.data}
                    }
                    return {status: true, data: data.data.data}
                })
                .catch(error =>{
                    logger.error("Verification Error",error.response.data)
                    return {status: false, error: error.response.data}
                })

            // logger.info("VErifying ============>>>>>> ", response);
        
            // return {
            //     status: response.data.status,
            //     data: response.data.data};
        } catch (error) {
            logger.error("Verify transaction failed", error.response.data|| error.message)
            return {
                status: false,
                error: error.response && error.response.data && error.response.data.message || error.message || 'Gateway Timeout',
            };
            // throw new CustomPaystackError(e);
        }
    }

    async chargeToken(payload){
        try {
            logger.info(payload.trx_ref, payload.cardAuth, payload.amount, payload.email);
            const response = await this._axios.post(`/transaction/charge_authorization`, {
                reference: payload.trx_ref,
                authorization_code: payload.cardAuth,
                amount: payload.amount * 100,
                currency: "NGN",
                metadata: payload.meta,
                email: payload.email.trim().toString()
            }).catch(error =>{
                return {error:  error.response}})
                .then(data => data?.error?  {error: data?.error.data} : {data: data});
            logger.info("Response", response?.error, response?.data?.data || response?.data);
            if(response?.data)
            return {data: response.data}

            return {error: response.error}
        } catch (e) {
            logger.error("paystack charge error---", e.message, e.response);
            logger.error(e.message, e.stack, {
                error: handleAxiosError(e),
                transactionId: payload.trx_ref,
                amount : payload.amount,
                email: payload.email
            }, true);
            return {
                statue: false,
                message: e.message
            };
        }
    }
}

module.exports = new PaystacksService();
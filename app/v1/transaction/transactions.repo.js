const Payment = require("../payment/payment.model");
const Repository = require("../../Repository");


class TransactionsRepo extends Repository{
    constructor() {
        super(Payment)
    }


}

module.exports = (new TransactionsRepo());
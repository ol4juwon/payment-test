const TransactionRepo = require("./transactions.repo");
exports.getAllTransactions = async ({condition={}, sort= "desc", orderBy="createdAt", page= 0, limit =10}) => {
    try {

        const transactions = await TransactionRepo.all(condition,sort,orderBy,page, limit)
        logger.info({transactions})
        return {
            data: transactions
        }
    }catch(e){
        return {error: e};
    }
}

exports.getUserTransactions = async (user_id, filter,) => {
    try {
        const {conditions , sortBy, page, limit } = filter;
        const transactions = await TransactionRepo.all(conditions, sortBy,page, limit).then(res => res)
        logger.info({transactions})
        return {
            data: transactions
        }
    }catch(e){
        return {error: e};
    }
}

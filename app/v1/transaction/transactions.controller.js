const transactionService = require("./transactions.service");

exports.getUserTransactions = async (req,res) => {
    const {user_id} = req.params;
    const filter = req.query
    if(!user_id || user_id === ':user_id'){
        return createErrorResponse(res, "please provide a valid user_id",["invalid user_id"], 422);
    }
    const { error, data } = await transactionService.getUserTransactions(user_id, filter);

    if (error) return createErrorResponse(res, "error fetching users", error, 400);

    return createSuccessResponse(res, "successful", data, 201);
}
exports.getAllTransactions = async (req,res) => {
    const filter = req.query
    logger.info({filter})
    const { error, data } = await transactionService.getAllTransactions(filter);

    if (error) return createErrorResponse(res, "error fetching users", error, 400);

    return createSuccessResponse(res, "successful", data, 201);
}
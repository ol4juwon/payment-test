'use strict';
const debug = require('debug')('äpp:debug');
const authService = require('./users.service');

exports.register = async (req, res) => {

	const payload = req.body;
	const { error, data } = await authService.register(payload);

	if (error) return createErrorResponse(res, "error creating user", error, 400);

	return createSuccessResponse(res, "Registration successful", data, 201);
};
exports.login = async (req, res) => {
	const payload = req.body;
	const { error, data } = await authService.login(payload);
	if (error) return createErrorResponse(res, error, 400);
	return createSuccessResponse(res, "Login successful", data, 200);
};

exports.changePassword = async (req,res) => {
	const payload = req.body;
	const { error, data } = await authService.changePassword(payload);
	if (error) return createErrorResponse(res, error, 400);
	return createSuccessResponse(res, "Login successful", data, 200);
}

exports.getCards = async (req,res) => {
	const user_id = req.user_id;
	logger.info('get cards for user', user_id);
	const { error, data } = await authService.getCards(user_id);

	if (error) return createErrorResponse(res, "error fetching cards user", error, 400);

	return createSuccessResponse(res, "successful", data, 201);
}
exports.getAllUsers = async (req,res) => {
	const { error, data } = await authService.getAllUsers();

	if (error) return createErrorResponse(res, "error fetching users", error, 400);

	return createSuccessResponse(res, "successful", data, 201);
}
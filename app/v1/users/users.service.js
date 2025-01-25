'use strict';
const User = require("./users.model");
const Cards = require("../payment/cards.model")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (payload) => {
	try {
		const {email, password} = payload;
		if (!email) return {error: "email is required"};
		if (!password) return {error: "password cannot be null"};
		const user = await User.findOne({email: email});
		if (!user) return {error: "Invalid email provided"};

		const validPass = await bcrypt.compare(password, user.password);
		if (!validPass) return {error: "Invalid password, try again"};


		const token = jwt.sign(
			{
				name: user.name,
				_id: user._id,
				email: user.email,
				role:"admin",
				avatar: user.avatar,
				username: user.username,
			},
			process.env.TOKEN_SECRET,
			{
				expiresIn: "2h",
			}
		);
		logger.info("Login successful")
		return {
			data: {
				user_id: user._id,
				balance: user.balance,
				token
			}
		};
	}catch (e){
		logger.error("Login Error: ", JSON.stringify(e))
		return {error: e}
	}
};
exports.register = async (payload) => {
  try{
    let error;
    let data;
  const { email, password, name} = payload;
	if (!email) return { error: "email is required" };
	if (!password) return { error: "password cannot be null" };
  const emailExist = await User.findOne({ email: email });
  if (emailExist) return { error: "User with email already exists" };
  const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);
	const user = new User({
    name,
		email: email,
		password: hashedPassword,
	});
  await user.save();
  const token = jwt.sign(
		{
			_id: user._id,
			email: user.email,
			name: user.name,
		},
		process.env.TOKEN_SECRET,
		{
			expiresIn: "2h",
		}
	);
data = {
  user_id: user._id,
	balance: user.balance,
  token}
  return {data};
  } catch (e){
    console.log('error', e)
    return { error: e}
  }

}
exports.getCards = async (id) => {
	const card  = await Cards.find().then(res=>res)
	logger.info({card})
	return {
		data: card
	}

}

exports.getAllUsers = async () => {
	try {
		const users = await User.find().then(res => res)
		logger.info({users})
		return {
			data: users
		}
	}catch(e){
		return {error: e};
	}
}
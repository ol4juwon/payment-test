'use strict';
const {verify} = require("jsonwebtoken");

// const {clients} = require('./Clients');

exports.validateUser = async (req, res, next) => {
  let token = req.headers['authorization'];
  if(!token){
    return createErrorResponse(res,"Please provide a valid token",403 )
  }
  token = token.split(" ")[1];
  try{
    const decoded = verify(token, process.env.JWT_PRIVATE_KEY);
    req.user_id = decoded._id
    req.user = decoded;
    req.role = decoded?.role || "user";
  }catch(err){
    logger.error("failed",err.message)
    return createErrorResponse(res,err.message,401 )
  }
  next();
};


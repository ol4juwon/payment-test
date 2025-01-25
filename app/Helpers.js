'use strict';

const axios = require('axios');

const  log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = "debug";
global.createSuccessResponse = (res, message = 'request successful',
    data, code = 200, isPaginated = false, success= true) => {
  if (isPaginated || (data && data.docs)) {
    data.data = data.docs;
    delete data.docs;
    res.response = {data};
    return res.status(code).json({message, code, success, data});
  }

  res.success = {data};
  return res.status(code).json({message, code, success, data});
};
global.logger = logger;
global.createErrorResponse =
      (res, message = 'Oops. An Error Occurred',
          error = [], code = 500, success =false) => {
        res.error = {error};
        return res.status(code).json({message, code, success, error});
      };

global.handleAxiosError = (error) => {
  try {
    if (error && error.response) {
      return {
        status: error.response.status,
        statusText: error.response.statusText,
        message: error.response.data.error,
        url: error.response.config.url,
        params: error.response.config.params,
        data: error.response.config.data,
        headers: error.response.headers,
        error: error.response.data,
        errorInString: JSON.stringify(error.response.data || {}),
        innerErrorText: error.response.data.error,
        innerError: JSON.stringify(error.response.data),
      };
    }
    return {
      status: 500,
      statusText: error.message || 'Unknown Error',
      message: error.message || 'Oops, An Error Occurred',
      stack: error.stack,
    };
  } catch (ex) {
    return {
      status: 500,
      statusText: 'Unknown Error',
      message: 'Oops, An Error Occurred',
      error: ex.message,
      stack: ex.stack,
    };
  }
};


global.getTimestamp = () => {
  const d = new Date();
  d.setTime(d.getTime() - new Date().getTimezoneOffset() * 60 * 1000);
  return d.getTime();
};

global.axiosRequest = async (url, method, data = {}) => {
  try {
    const response = await axios[method](url, data);
    return response.data;
  } catch (e) {
    logger.error('axios error', e, e.message, data);
    logger.error(e.message, new Error(e).stack, {e: e, request: data});
    return null;
  }
};




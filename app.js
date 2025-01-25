'use strict';
require('dotenv').config({});
const moment = require('moment');
const createError = require('http-errors');

const express = require('express');


const app = express();
const cors = require('cors');
require('./app/Helpers');
require('express-async-errors');
require('./startups')(app, express);
// middlewares
app.use(cors());

app.use(express.json());
app.set('view engine', 'jade');
app.set('views', './views');
app.use((req, res, next) => {
  const requestId = getTimestamp();
  logger.info('Time Started',
      moment().toISOString(true), 'headers', JSON.stringify(req.headers));
  const url = req.protocol + '://' + req.get('host') + req.originalUrl;
  logger.info('Response', requestId);
  logger.info({url});
  const cleanup = () => {
    res.removeListener('finish', logFn);
    res.removeListener('close', abortFn);
    res.removeListener('error', errorFn);
  };
  const logFn = () => {
    logger.info('Response', requestId);
    logger.info('Time Ended', moment().toISOString(true));
    cleanup();
  };

  const abortFn = () => {
    cleanup();
    logger.info('Time Ended', moment().toISOString(true));
  };
  const errorFn = (err) => {
    cleanup();
    logger.error('Time Ended Error', moment().toISOString(true));
  };

  res.on('finish', logFn); // successful pipeline (regardless of its response)
  res.on('close', abortFn); // aborted pipeline
  res.on('error', errorFn); // pipeline internal error
  return next();
});
app.use('/api/v1', require('./routes/v1'));


app.use((req, res, next) => {
  return next(createError(404));
});


// error handler
app.use((err, req, res) => {
  res.status(err && err.status || 500);
  res.send({error: err && err.message || 'An error occurred'});
});


module.exports = app;

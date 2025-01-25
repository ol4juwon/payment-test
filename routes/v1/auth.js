'use strict';
// eslint-disable-next-line new-cap
const router = require('express').Router();
const userController = require('../../app/v1/users/users.controllers');
router.post('/register',userController.register);
router.post('/login', userController.login);

module.exports = router;

'use strict';
// eslint-disable-next-line new-cap
const router = require('express').Router();
const userController = require('../../app/v1/users/users.controllers');
const {validateUser} = require("../../app/Middleware");
router.use(validateUser)
router.get('/cards',userController.getCards);
router.get("/", userController.getAllUsers);
module.exports = router;

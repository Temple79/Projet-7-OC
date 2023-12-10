const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const checkNewUser = require('../middleware/checkNewUser');
const isEmailValid = require('../middleware/isEmailValid');

router.post('/signup',checkNewUser, isEmailValid, userCtrl.signup);
router.post('/login', userCtrl.login);


module.exports = router;
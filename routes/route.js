const express = require('express');
const authCtrl = require('../controller/authCtrl');
const router = express.Router();

router.post('/users/register', authCtrl.register);
router.post('/users/login', authCtrl.login);
router.post('/users/logout', authCtrl.logout);

module.exports = router;
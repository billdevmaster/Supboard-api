const express = require('express');
const router = express.Router();

const authCtrl = require('../controller/authCtrl');
const locationCtrl = require('../controller/locationCtrl');
const priceCtrl = require('../controller/settings/priceCtrl');
const terrainCtrl = require('../controller/settings/terrainCtrl');
const stationCtrl = require('../controller/settings/stationCtrl');
const lockerCtrl = require('../controller/lockerCtrl');

const authUtil = require('../utility/authUtil');

router.post('/users/register', authCtrl.register);
router.post('/users/login', authCtrl.login);
router.post('/users/logout', authCtrl.logout);

router.post('/location/edit', authUtil.authorizeUser, locationCtrl.edit);
router.post('/location/getList', authUtil.authorizeUser, locationCtrl.getList);
router.post('/location/getListByUser', authUtil.authorizeUser, locationCtrl.getListByUser);
router.post('/location/deleteItem', authUtil.authorizeUser, locationCtrl.deleteItem);
router.post('/location/getItem', authUtil.authorizeUser, locationCtrl.getItem);

router.post('/settings/price/getList', authUtil.authorizeUser, priceCtrl.getList);
router.post('/settings/price/getListByCreator', authUtil.authorizeUser, priceCtrl.getListByCreator);
router.post('/settings/price/getPrice', authUtil.authorizeUser, priceCtrl.getPrice);
router.post('/settings/price/edit', authUtil.authorizeUser, priceCtrl.edit);
router.post('/settings/price/deleteItem', authUtil.authorizeUser, priceCtrl.deleteItem);

router.post('/settings/terrain/getList', authUtil.authorizeUser, terrainCtrl.getList);
router.post('/settings/terrain/getItem', authUtil.authorizeUser, terrainCtrl.getItem);
router.post('/settings/terrain/edit', authUtil.authorizeUser, terrainCtrl.edit);
router.post('/settings/terrain/deleteItem', authUtil.authorizeUser, terrainCtrl.deleteItem);

router.post('/settings/station/getList', authUtil.authorizeUser, stationCtrl.getList);
router.post('/settings/station/getListByUser', authUtil.authorizeUser, stationCtrl.getListByUser);
router.post('/settings/station/getItem', authUtil.authorizeUser, stationCtrl.getItem);
router.post('/settings/station/edit', authUtil.authorizeUser, stationCtrl.edit);
router.post('/settings/station/deleteItem', authUtil.authorizeUser, stationCtrl.deleteItem);

router.post('/locker/getList', authUtil.authorizeUser, lockerCtrl.getList);

module.exports = router;
// eslint-disable-next-line new-cap
const router = require('express').Router();
const {module: controller} = require('../controllers');

router.get('/online', controller.onlineUsers);

router.get('/statistics', controller.statistics);

router.get('/recentusers', controller.recentUsers);

module.exports = router;

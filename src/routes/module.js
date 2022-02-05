// eslint-disable-next-line new-cap
const router = require('express').Router();
const {module: controller} = require('../controllers');

router.get('/statistics', controller.statistics);

module.exports = router;

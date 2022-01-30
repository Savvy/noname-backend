// eslint-disable-next-line new-cap
const router = require('express').Router();
const {category: controller} = require('../controllers');

router.post('/', controller.create);

module.exports = router;

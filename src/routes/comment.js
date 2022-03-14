// eslint-disable-next-line new-cap
const router = require('express').Router();
const {isAuthenticated} = require('../middleware');
const {comment: controller} = require('../controllers');

router.post('/', isAuthenticated, controller.create);

module.exports = router;

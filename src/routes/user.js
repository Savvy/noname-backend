// eslint-disable-next-line new-cap
const router = require('express').Router();
const {isAuthenticated} = require('../middleware');
const {user: controller} = require('../controllers');

router.get('/', isAuthenticated, controller.get);

router.post('/:username', controller.update);

module.exports = router;

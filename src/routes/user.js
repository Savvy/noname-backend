// eslint-disable-next-line new-cap
const router = require('express').Router();
const {isAuthenticated} = require('../middleware');
const {user: controller} = require('../controllers');

router.get('/', isAuthenticated, controller.get);

router.post('/changePassword', isAuthenticated, controller.changePassword);

router.post('/:username', isAuthenticated, controller.update);

module.exports = router;

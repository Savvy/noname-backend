// eslint-disable-next-line new-cap
const router = require('express').Router();
const {isAuthenticated} = require('../middleware');
const {user: controller} = require('../controllers');

router.get('/', isAuthenticated, controller.get);

router.get('/find/:username', controller.find);

router.get('/recent', controller.findLatest);

router.post('/changePassword', isAuthenticated, controller.changePassword);

router.post('/requestReset', controller.requestReset);

router.post('/resetPassword/:token', controller.resetPassword);

router.post('/update/:username', isAuthenticated, controller.update);

module.exports = router;

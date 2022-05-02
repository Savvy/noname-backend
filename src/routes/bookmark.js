// eslint-disable-next-line new-cap
const router = require('express').Router();
const {isAuthenticated} = require('../middleware');
const {bookmark: controller} = require('../controllers');

router.post('/', isAuthenticated, controller.add);
router.get('/:page', controller.get);

module.exports = router;

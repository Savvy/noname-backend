// eslint-disable-next-line new-cap
const router = require('express').Router();
const {isAuthenticated} = require('../middleware');
const {thread: controller} = require('../controllers');

router.post('/', isAuthenticated, controller.create);

router.get('/', controller.getAll);
router.get('/:slug', controller.get);

module.exports = router;
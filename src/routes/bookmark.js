// eslint-disable-next-line new-cap
const router = require('express').Router();
const {isAuthenticated} = require('../middleware');
const {bookmark: controller} = require('../controllers');

router.post('/', isAuthenticated, controller.add);

router.delete('/', isAuthenticated, controller.remove);

router.get('/', controller.get);
router.get('/:page', controller.get);

module.exports = router;

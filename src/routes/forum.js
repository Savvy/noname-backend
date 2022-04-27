// eslint-disable-next-line new-cap
const router = require('express').Router();
const {forum: controller} = require('../controllers');

router.get('/', controller.getAll);
router.get('/:slug/:page', controller.get);
router.post('/', controller.create);

module.exports = router;

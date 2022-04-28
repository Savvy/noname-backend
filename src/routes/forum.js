// eslint-disable-next-line new-cap
const router = require('express').Router();
const {forum: controller} = require('../controllers');

router.get('/', controller.getAll);
router.post('/', controller.create);

router.get('/:slug', controller.get);
router.get('/:slug/:page', controller.get);

module.exports = router;

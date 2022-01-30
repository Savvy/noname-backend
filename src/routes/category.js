// eslint-disable-next-line new-cap
const router = require('express').Router();
const {category: controller} = require('../controllers');

router.get('/', controller.getAll);
router.post('/', controller.create);
router.delete('/', controller.delete);

module.exports = router;

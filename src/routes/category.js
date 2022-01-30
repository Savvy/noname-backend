// eslint-disable-next-line new-cap
const router = require('express').Router();
const {categoryController} = require('../controllers');

router.post('/', categoryController.create);

module.exports = router;

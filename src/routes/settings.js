// eslint-disable-next-line new-cap
const router = require('express').Router();
/* const {isAuthenticated} = require('../middleware'); */
const {settings: controller} = require('../controllers');

/* router.use(isAuthenticated); */

router.get('/', controller.getSettings);

router.get('/config', controller.getConfig);

module.exports = router;

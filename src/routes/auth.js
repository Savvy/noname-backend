// eslint-disable-next-line new-cap
const router = require('express').Router();
const {verifySignup} = require('../middleware');
const {auth: controller} = require('../controllers');

router.post('/login', controller.login);

router.get('/logout', function(req, res, next) {
  req.logout();
  return res.json({
    success: true,
    message: 'logged_out',
  });
});

router.post('/register', [verifySignup.checkUsernameAndEmail],
    controller.register);

router.get('/confirm', function(req, res, next) {});

module.exports = router;

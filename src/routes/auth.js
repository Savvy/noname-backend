// eslint-disable-next-line new-cap
const router = require('express').Router();
const {verifySignup} = require('../middleware');
const {authController} = require('../controllers');

router.post('/login', function(req, res, next) {
  return null; // Handle login
});

router.get('/logout', function(req, res, next) {
  req.logout();
  return res.json({
    success: true,
    message: 'logged_out',
  });
});

router.post('/register', [verifySignup.checkUsernameAndEmail],
    authController.register);

router.get('/confirm', function(req, res, next) {});

module.exports = router;

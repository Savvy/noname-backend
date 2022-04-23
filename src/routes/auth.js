// eslint-disable-next-line new-cap
const router = require('express').Router();
const {isAuthenticated, verifySignup} = require('../middleware');
const {auth: controller} = require('../controllers');

router.get('/discord', controller.discordLogin);
router.get('/discord/callback', controller.discordCallback);

router.get('/twitter', controller.twitterLogin);
router.get('/twitter/callback', controller.twitterCallback);

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

router.get('/confirm/resend', isAuthenticated, controller.resend);

router.get('/confirm/:token', controller.verify);

module.exports = router;

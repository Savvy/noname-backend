const {User} = require('../../models');
const LocalStrategy = require('passport-local').Strategy;

module.exports = new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, function(email, password, done) {
  User.findOne({email: email}).then(function(user) {
    if (!user || !user.validPassword(password)) {
      return done(null, false, {error: 'invalid_credentials'});
    }

    done(null, user, {success: true, message: 'success_login'});
  }).catch(done);
});

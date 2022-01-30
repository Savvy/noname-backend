const {User} = require('../models');

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    // find User and return done(null user); if no error
    User.findById(id, function(error, user) {
      if (error) {
        return done(error);
      }
      return done(null, user);
    });
  });

  passport.use('local', require('./strategies/LocalStrat'));
};

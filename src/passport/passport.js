const {User} = require('../models');

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    // find User and return done(null user); if no error
    User.find({_id: id}).populate('details role')
        .lean().exec(function(error, results) {
          if (error) {
            return done(error);
          }

          if (results.length < 1) {
            return done(new Error('user_not_found'));
          }

          return done(null, results[0]);
        });
  });

  passport.use('local', require('./strategies/LocalStrat'));
  passport.use('discord', require('./strategies/DiscordStrat'));
  passport.use('twitter', require('./strategies/TwitterStrat'));
};

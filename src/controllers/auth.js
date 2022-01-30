const passport = require('passport');
const {User: Model} = require('../models');

const controller = module.exports;

controller.login = function(req, res, next) {
  passport.authenticate('local', function(error, user, info) {
    if (error) {
      res.status(500).send({message: error});
      return;
    }

    if (!user) {
      res.status(400).send(info);
      return;
    }

    // Check for verification, decide if we want to allow login when unverified.

    req.login(user, function(error) {
      if (error) {
        res.status(500).send({message: error});
        return;
      }

      res.status(200).json(info);
    });
  })(req, res, next);
};

controller.register = function(req, res, next) {
  const user = new Model({
    username: req.body.username,
    email: req.body.email,
  });

  user.setPassword(req.body.password);

  user.save((error, user) => {
    if (error) {
      res.status(500).send({message: error});
      return;
    }
    res.json({
      success: true,
      message: 'user_registered',
      result: user,
    });
  });
};

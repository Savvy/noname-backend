const passport = require('passport');
const gravatar = require('gravatar');
const {User: Model, UserDetails} = require('../models');

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

    // TODO: Check for verification,
    // decide if we want to allow login when unverified.

    req.login(user, async function(error) {
      if (error) {
        res.status(500).send({message: error});
        return;
      }

      await Model.findByIdAndUpdate(req.user._id, {
        lastSeen: new Date(),
      });

      res.status(200).json({
        ...info,
        user,
      });
    });
  })(req, res, next);
};

controller.discordLogin = passport.authenticate('discord');

controller.discordCallback = passport.authenticate('discord', {
  successRedirect: process.env.CLIENT_URL,
  failureRedirect: (process.env.CLIENT_URL + '/login'),
}), function(req, res) {
  res.redirect(process.env.CLIENT_URL);
};

controller.twitterLogin = passport.authenticate('twitter');

controller.twitterCallback = passport.authenticate('twitter', {
  successRedirect: process.env.CLIENT_URL,
  failureRedirect: (process.env.CLIENT_URL + '/login'),
}), function(req, res) {
  res.redirect(process.env.CLIENT_URL);
};

controller.register = async function(req, res, next) {
  const user = new Model({
    username: req.body.username,
    email: req.body.email,
  });

  // TODO: Grab gravatar defaults from another source.

  // Create and save UserDetails
  const userDetails = new UserDetails({
    avatar: gravatar.url(user.email, {protocol: 'https', s: '130', d: 'https://i.imgur.com/45vM6qK.jpg'}),
  });

  try {
    user.setPassword(req.body.password);
    user.generateToken();

    if (error) {
      res.status(500).send({message: error});
      return;
    }
    // TODO: Send user confirmation email

    await userDetails.save();
    user.details = userDetails;
    await user.save();
    res.json({
      success: true,
      message: 'user_registered',
      result: user,
    });
  } catch (error) {
    res.status(500).send(error);
    return;
  }
};

controller.verify = async function(req, res, next) {
  const filter = {confirmationCode: req.params.token};
  const update = {status: 'Active', confirmationCode: ''};
  try {
    await Model.findOneAndUpdate(filter, update);
    res.status(200).json({
      success: true,
      message: 'account_confirmed',
    });
  } catch (error) {
    res.status(500).send({error: error});
    return;
  }
};

const passport = require('passport');
const gravatar = require('gravatar');
const {emailer} = require('../helpers');
const {User: Model, UserDetails, Role} = require('../models');
const {logsnag} = require('../helpers');

const controller = module.exports;

controller.login = function(req, res, next) {
  passport.authenticate('local', function(error, user, info) {
    if (error) {
      return next(error);
    }

    if (!user) {
      res.status(400).send(info);
      return;
    }

    // TODO: Check for verification,
    // decide if we want to allow login when unverified.

    req.login(user, async function(error) {
      if (error) {
        return next(error);
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
  const count = await Model.countDocuments({});

  const filter = count == 0 ? {isAdmin: true} : {isDefault: true};
  const role = await Role.findOne(filter);

  const user = new Model({
    username: req.body.username,
    email: req.body.email,
    role: role,
  });

  // TODO: Grab gravatar defaults from another source.

  // Create and save UserDetails
  const userDetails = new UserDetails({
    avatar: gravatar.url(user.email, {protocol: 'https', s: '130', d: 'https://i.imgur.com/45vM6qK.jpg'}),
  });

  try {
    user.setPassword(req.body.password);
    user.generateConfirmation();

    // TODO: Send user confirmation email
    const url = `${process.env.CLIENT_URL}/confirm/${user.confirmationCode}`;

    emailer.send('verification', user, {
      userName: user.username,
      verificationUrl: url,
      subject: 'Confirm Your Email Address',
    });

    logsnag.publish({
      ...logsnag.EVENTS.USER_REGISTRATION,
      description: `${user.email} registered`,
    });

    await userDetails.save();
    user.details = userDetails;
    await user.save();
    res.json({
      success: true,
      message: 'user_registered',
      result: user,
    });
  } catch (error) {
    next(error);
  }
};

controller.resend = async function(req, res, next) {
  try {
    const user = req.user;
    const url = `${process.env.CLIENT_URL}/confirm/${user.confirmationCode}`;
    await emailer.send('verification', user, {
      userName: user.username,
      verificationUrl: url,
      subject: 'Confirm Your Email Address',
    });

    res.status(200).json({
      success: true,
      message: 'confirmation_resent',
    });
  } catch (error) {
    next(error);
  }
};

controller.verify = async function(req, res, next) {
  const filter = {confirmationCode: req.params.token};
  const update = {status: 'Active', confirmationCode: null};
  try {
    const doc = await Model.findOneAndUpdate(filter, update);
    if (!doc) {
      return res.status(500).json({
        success: false,
        message: 'account_not_found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'account_confirmed',
    });
  } catch (error) {
    next(error);
  }
};

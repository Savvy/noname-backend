const {User} = require('../models');

const middleware = module.exports;

middleware.checkUsernameAndEmail = function(req, res, next) {
  const {username, email} = req.body;

  User.findOne({
    username: username,
  }).exec((error, user) => {
    if (error) {
      return next(error);
    }

    if (user) {
      res.status(400).send({message: 'not_unique_name'});
      return;
    }

    User.findOne({
      email: email,
    }).exec((error, user) => {
      if (error) {
        return next(error);
      }

      if (user) {
        res.status(400).send({message: 'not_unique_email'});
        return;
      }

      next();
    });
  });
};

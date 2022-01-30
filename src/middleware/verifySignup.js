const {User} = require('../models');

const middleware = module.exports;

middleware.checkUsernameAndEmail = function(req, res, next) {
  const {username, email} = req.body;

  User.findOne({
    usernmae: username,
  }).exec((error, user) => {
    if (error) {
      res.status(500).send({message: error});
      return;
    }

    if (user) {
      res.status(400).send({message: 'not_unique_name'});
      return;
    }

    User.findOne({
      email: email,
    }).exec((error, user) => {
      if (error) {
        res.status(500).send({message: error});
        return;
      }

      if (user) {
        res.status(400).send({message: 'not_unique_email'});
        return;
      }

      next();
    });
  });
};
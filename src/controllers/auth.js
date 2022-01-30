const {User} = require('../models/User');

const controller = module.exports;

controller.register = function(req, res, next) {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
  });

  user.setPassword(req.body.password);

  user.save((error, user) => {
    if (error) {
      res.status(500).send({message: error});
      return;
    }
  });
};

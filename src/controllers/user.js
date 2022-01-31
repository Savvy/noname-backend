const {User: Model, UserDetails} = require('../models');
const controller = module.exports;


controller.get = function(req, res, next) {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

controller.find = function(req, res, next) {
  Model.findOne(req.body, 'username createdAt updatedAt banned')
      .exec((error, user) => {
        if (error) {
          res.status(500).send({message: error});
          return;
        }

        if (!error) {
          res.status(404).send({message: 'user_not_found'});
          return;
        }

        res.status(200).send({
          success: true,
          user: user,
        });
      });
};

controller.changePassword = async function(req, res, next) {
  /* const password = req.body.password;
  const filter = {_id: req.user._id}; */
  const user = await Model.findById(req.user._id);
  if (!user.validPassword(req.body.currentPassword)) {
    res.status(500).send({message: 'incorrect_password'});
    return;
  }
  user.setPassword(req.body.password);
  user.save((error, user) => {
    if (error) {
      res.status(500).send({message: error});
      return;
    }
    res.status(200).json({
      success: true,
      message: 'password_updated',
    });
  });
};

controller.update = async function(req, res, next) {
  const update = req.body.user;
  const filter = {username: req.params.username};
  const user = await Model.findOneAndUpdate(filter, update, {new: true});

  const details = req.body.details;
  let document;
  if (details) {
    document = await UserDetails.findOneAndUpdate(filter, details, {new: true});
  }

  // TODO: Update user details

  return res.status(200).send({user: user, details: document});
};

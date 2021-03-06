const {
  User: Model, UserDetails,
  Thread, Post, Comment, Bookmark,
} = require('../models');
const config = require('../data/config.json');
const {emailer} = require('../helpers');
const controller = module.exports;

controller.get = async function(req, res, next) {
  const user = {...req.user};
  delete user.password;
  delete user.confirmationCode;
  user.wallPosts = await Comment.find({user: user._id})
      .populate({
        path: 'user author',
        select: 'username',
        populate: {
          path: 'details',
        },
      })
      .populate({
        path: 'children',
        populate: {
          path: 'user author',
          select: 'username',
          populate: {
            path: 'details',
          },
        },
      }).sort({
        createdAt: '-1',
      });

  user.bookmarks = await Bookmark.find({user: user._id});

  user.threadCount = await Thread.countDocuments({user: user});
  user.postCount = await Post.countDocuments({user: user});
  res.status(200).json({
    success: true,
    user: user,
  });
};

controller.find = function(req, res, next) {
  Model.findOne({username: req.params.username},
      '-password -confirmationCode -email').
      populate('details role').lean().exec(async (error, user) => {
        if (error) {
          return next(error);
        }

        if (!user) {
          res.status(404).send({message: 'user_not_found'});
          return;
        }

        const comments = await Comment.find({user: user._id})
            .populate({
              path: 'user author',
              select: 'username details',
              populate: {
                path: 'details',
              },
            })
            .populate({
              path: 'children',
              populate: {
                path: 'user author',
                select: 'username details',
                populate: {
                  path: 'details',
                },
              },
            })
            .sort({
              createdAt: '-1',
            });

        user.wallPosts = comments;

        user.threadCount = await Thread.countDocuments({user: user});
        user.postCount = await Post.countDocuments({user: user});

        res.status(200).send({
          success: true,
          user: user,
        });
      });
};

controller.findLatest = function(req, res, next) {
  Model.findOne({}, 'username', {
    sort: {'createdAt': -1},
  }, function(error, user) {
    if (error) {
      return next(error);
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
    return next(error);
  }
  user.setPassword(req.body.password);
  user.save((error, user) => {
    if (error) {
      return next(error);
    }
    res.status(200).json({
      success: true,
      message: 'password_updated',
    });
  });
};

controller.requestReset = async function(req, res, next) {
  const filter = {email: req.body.email};
  try {
    const doc = await Model.findOne(filter);
    if (!doc) {
      return res.status(200).json({
        success: true,
        message: 'password_request_sent',
      });
    }

    doc.generateReset();
    doc.save();

    const url = `${process.env.CLIENT_URL}/reset-password/${doc.resetToken}`;
    await emailer.send('forgot-password', doc, {
      userName: doc.username,
      resetUrl: url,
      subject: 'Reset Your Password',
    });

    res.status(200).json({
      success: true,
      message: 'confirmation_resent',
    });
  } catch (error) {
    next(error);
  }
};

controller.resetPassword = async function(req, res, next) {
  const filter = {resetToken: req.params.token};

  try {
    const doc = await Model.findOne(filter);
    if (!doc) {
      return res.status(500).json({
        success: false,
        message: 'reset_not_found',
      });
    }

    doc.setPassword(req.body.password);
    await doc.save();
    res.status(200).json({
      success: true,
      message: 'password_reset',
    });
  } catch (error) {
    next(error);
  }
};

controller.changeUsername = async function(req, res, next) {
  if (!req.body.username) {
    return res.status(400).send({message: 'username_field_required'});
  }

  try {
    const count = await Model.countDocuments({username: req.body.username});

    if (count) {
      return res.status(400).send({message: 'not_unique_name'});
    }

    const update = await Model.findByIdAndUpdate(req.user._id,
        {username: req.body.username});
    await emailer.send('account-changed', update, {
      userName: update.username,
      subject: 'Username Changed',
      change: 'username',
    });
    res.status(200).json({
      success: true,
      message: 'username_updated',
    });
  } catch (error) {
    next(error);
  }
};

controller.changeEmail = async function(req, res, next) {
  if (!req.body.email) {
    return res.status(400).send({message: 'email_field_required'});
  }

  try {
    const count = await Model.countDocuments({email: req.body.email});

    if (count) {
      return res.status(400).send({message: 'not_unique_email'});
    }

    const update = await Model.findByIdAndUpdate(req.user._id,
        {email: req.body.email});
    await emailer.send('account-changed', update, {
      userName: update.username,
      subject: 'Email Changed',
      change: 'email',
    });
    res.status(200).json({
      success: true,
      message: 'email_updated',
    });
  } catch (error) {
    next(error);
  }
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

controller.avatar = async function(req, res, next) {
  try {
    const update = {
      avatarType: config.storage === 'disk' ? 'Disk' : 'Custom',
      avatar: config.storage === 'disk' ?
      `avatars/${req.file.filename}` : req.file.location,
    };
    await UserDetails.findOneAndUpdate({
      _id: req.user.details._id,
    }, update);
    res.status(200).json({
      success: true,
      message: 'avatar_updated',
      avatar: update,
    });
  } catch (error) {
    return next(error);
  }
};

controller.members = async function(req, res, next) {
  const staff = await Model.find({isStaff: true}).select('username role')
      .populate({
        path: 'details',
        select: 'avatarType avatar',
      })
      .populate({
        path: 'role',
      });
  const members = await Model
      .find({isStaff: false})
      .sort('-createdAt')
      .limit(15).select('username role')
      .populate({
        path: 'details',
        select: 'avatarType avatar',
      })
      .populate({
        path: 'role',
      });

  res.status(200).json({
    success: true,
    message: 'members_list',
    staff: staff,
    members: members,
  });
};

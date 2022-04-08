/* eslint-disable require-jsdoc */
const {User: Model, UserDetails} = require('../../models');
const gravatar = require('gravatar');
const DiscordStrategy = require('passport-discord').Strategy;

const scopes = ['identify', 'email'];

module.exports = new DiscordStrategy({
  clientID: process.env.DISCORD_ID,
  clientSecret: process.env.DISCORD_SECRET,
  callbackURL: process.env.DISCORD_CALLBACK,
  scope: scopes,
  passReqToCallback: true,
}, async function(req, _, _, profile, done) {
  // Check for same email as well
  let user = await findAndUpdate({'socials.discord.id': profile.id}, profile);

  if (user) {
    return done(null, user, {success: true, message: 'success_login'});
  }

  if (req.user) {
    user = await findAndUpdate({_id: req.user._id}, profile);
    return done(null, user, {success: true, message: 'success_login'});
  }

  // TODO: Create a new user
  createNewUser(profile).then((user) => {
    return done(null, user, {success: true, message: 'success_login'});
  }).catch(done);
});

function findAndUpdate(filter, profile) {
  return Model.findOneAndUpdate(filter, {
    'socials.discord': {
      id: profile.id,
      username: profile.username,
      discriminator: profile.discriminator,
    },
  }, {populate: 'details'});
};

async function createNewUser(profile) {
  const user = new Model({
    username: profile.username + profile.discriminator,
    email: profile.email,
    status: 'Active',
    socials: {
      discord: {
        id: profile.id,
        username: profile.username,
        discriminator: profile.discriminator,
      },
    },
  });

  // TODO: Grab gravatar defaults from another source.
  const userDetails = new UserDetails({
    avatar: gravatar.url(user.email, {protocol: 'https', s: '130', d: 'https://i.imgur.com/45vM6qK.jpg'}),
  });

  try {
    await userDetails.save();
    user.details = userDetails;
    return user.save();
  } catch (error) {
    return new Promise((_, rej) => rej(error));
  }
};

const {Role} = require('../models');
const defaultRoles = require('./default_roles.json');
const data = module.exports;

data.handleRoles = async function() {
  const count = await Role.countDocuments({});

  if (count >= 1) {
    return;
  }

  defaultRoles.forEach((defaultRole) => {
    const role = new Role(defaultRole);
    role.save().then((_) => {
      console.log(`Created default role: ${defaultRole.name}`);
    }).catch((error) => {
      console.log(`Error creating default role: ${defaultRole.name}`);
      console.error(error);
    });
  });
};

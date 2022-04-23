const nodemailer = require('nodemailer');
const {htmlToText} = require('html-to-text');
const psl = require('psl');
const ejs = require('ejs');
const path = require('path');
const config = require('../data/config.json');

const Emailer = module.exports;

// These templates require emails
const TPL_REQ_EMAIL = ['welcome', 'activation'];

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: process.env.SMTP_SERVICE,
  auth: {
    user: process.env.SMTP_AUTH_USER,
    pass: process.env.SMTP_AUTH_PASS,
  },
});


Emailer.send = async function(template, user, params) {
  // Handle global params
  params.siteName = config.siteName;

  if (TPL_REQ_EMAIL.includes(template)) {
    // Ensure email is included in passed parameters
    params.email = user.email;
  }

  const [error, data] = await new Promise((resolve) => {
    const file = path.join(__dirname, `../templates/${template}.ejs`);
    ejs.renderFile(file, params, (error, data) => resolve([error, data]));
  });

  if (error) {
    return new Promise((_, rej) => rej(error));
  }

  const hostName = psl.get(extractHostname(process.env.CLIENT_URL));
  const defaultFrom = 'NoName <noreply@noname.red>';

  return transporter.sendMail({
    from: defaultFrom || `${params.siteName} <no-reply@${hostName}>`,
    to: user.email,
    subject: params.subject || 'No Subject Provided',
    text: htmlToText(data, {
      tags: {img: {format: 'skip'}},
    }),
    html: data,
  });
};

extractHostname = function(url) {
  let hostname;

  if (url.indexOf('//') > -1) {
    hostname = url.split('/')[2];
  } else {
    hostname = url.split('/')[0];
  }

  hostname = hostname.split(':')[0];
  hostname = hostname.split('?')[0];

  return hostname;
};

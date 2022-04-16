const Emailer = module.exports;
const {htmlToText} = require('html-to-text');
const psl = require('psl');
const nodemailer = require('nodemailer');

// These templates require emails
const TPL_REQ_EMAIL = ['welcome', 'activation'];

Emailer.send = function(template, user, params) {
  if (TPL_REQ_EMAIL.includes(template)) {
    // Ensure email is included in passed parameters
  }

  sendToEmail({
    from: (`no-reply@${psl.get(extractHostname(process.env.CLIENT_URL))}`),
    to: user.email,
    subject: params.email,
    text: htmlToText(template, {
      tags: {img: {format: 'skip'}},
    }),
    html: template,
  });
};


sendToEmail = async function(options) {
  const testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail(options);

  console.log('Message sent: %s', info.messageId);

  // Preview only available when sending through an Ethereal account
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
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

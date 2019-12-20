const nodemailer = require('nodemailer');

const sendMail = async (sendTo, subject, messageBody) => {
  const transportLayer = nodemailer.createTransport({
    host: process.env.MAIL_SMTP_HOST,
    port: process.env.MAIL_SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD
    }
  });

  const message = {
    from: `${process.env.MAIL_FROM_NAME} ${process.env.MAIL_FROM_EMAIL}`,
    to: sendTo,
    subject,
    text: messageBody
  };

  await transportLayer.sendMail(message);
};

module.exports = sendMail;

const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1- define a transporter
  const transporter = nodemailer.createTransport({
    // // service : 'Gmail',
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  //2- define email options
  const mailOptions = {
    from: '"Aliya Shaik😃" <skaliya502@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3- actually send email
  const info = await transporter.sendMail(mailOptions); //promise
  // return info.messageId;
};

module.exports = sendEmail;

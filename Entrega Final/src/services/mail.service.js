import nodemailer from "nodemailer";

const { MAIL_USER, MAIL_PASS, MAIL_SERVICE = "gmail" } = process.env;

const transporter = nodemailer.createTransport({
  service: MAIL_SERVICE,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS
  }
});

const sendMail = async ({ to, subject, html }) => {
  return transporter.sendMail({
    from: MAIL_USER,
    to,
    subject,
    html
  });
};

export default { sendMail };

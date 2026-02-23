const { BrevoClient } = require("@getbrevo/brevo");

const nodemailer = require("nodemailer");

const mailer = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const verify = async (req, res) => {
  try {
    await mailer.verify();
    return res.status(200).send("SMTP CONNECTION OK");
  } catch (err) {
    console.error("SMTP VERIFY ERROR:", err);
    res.status(200).send(err);
    return false;
  }
};

const sendGoogleEmail = async (to, otp) => {
  const subject = "Password Reset";
  const html = `<div style="
    font-family: Arial, sans-serif;
    background-color: #f4f6f8;
    padding: 40px 20px;
  ">
    <div style="
      max-width: 500px;
      margin: auto;
      background: white;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.05);
      text-align: center;
    ">
      
      <h2 style="color: #333; margin-bottom: 10px;">
        Password Reset Request
      </h2>

      <p style="color: #555; font-size: 14px;">
        Use the OTP below to reset your password.
      </p>

      <div style="
        margin: 30px 0;
        font-size: 32px;
        font-weight: bold;
        letter-spacing: 8px;
        color: #95d14c;
      ">
        ${otp}
      </div>

      <p style="color: #777; font-size: 13px;">
        This code expires in 10 minutes.
      </p>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />

      <p style="font-size: 12px; color: #999;">
        If you didn’t request a password reset, you can safely ignore this email.
      </p>

    </div>
  </div>
`;

  const result = await mailer.sendMail({
    from: '"Exptrac" <${process.env.EMAIL_USER}>',
    to,
    subject,
    html,
  });
};

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

const sendEmail = async (toEmail, otp) => {
  const subject = "Password Reset";
  const html = `<div style="
    font-family: Arial, sans-serif;
    background-color: #f4f6f8;
    padding: 40px 20px;
  ">
    <div style="
      max-width: 500px;
      margin: auto;
      background: white;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.05);
      text-align: center;
    ">
      
      <h2 style="color: #333; margin-bottom: 10px;">
        Password Reset Request
      </h2>

      <p style="color: #555; font-size: 14px;">
        Use the OTP below to reset your password.
      </p>

      <div style="
        margin: 30px 0;
        font-size: 32px;
        font-weight: bold;
        letter-spacing: 8px;
        color: #95d14c;
      ">
        ${otp}
      </div>

      <p style="color: #777; font-size: 13px;">
        This code expires in 10 minutes.
      </p>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />

      <p style="font-size: 12px; color: #999;">
        If you didn’t request a password reset, you can safely ignore this email.
      </p>

    </div>
  </div>
`;
  await brevo.transactionalEmails.sendTransacEmail({
    sender: {
      email: process.env.BREVO_FROM_EMAIL,
      name: "exptrac",
    },
    subject: subject,
    htmlContent: html,
    to: [
      {
        email: toEmail,
      },
    ],
  });
};

module.exports = { sendEmail, verify };

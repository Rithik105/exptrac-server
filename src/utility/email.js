const nodemailer = require("nodemailer");

const mailer = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, otp) => {
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

module.exports = { sendEmail };

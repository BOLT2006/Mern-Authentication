import nodemailer from "nodemailer";
import "dotenv/config";

const sendOtpMail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  // mail configuration
  const maiConfiguration = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Password reset OTP",
    html: `<p> Your OTP for password reset is : <b>${otp}</b>. It is vaild for 10 min </p>  `,
  };

  await transporter.sendMail(maiConfiguration);
};
export { sendOtpMail };

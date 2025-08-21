import nodemailer from "nodemailer";
import path from "path";
import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
} from "./emailTemplates.js";

export const sendVerficationEmail = async (to, verficationToken) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"AUTH COMPANY" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Email Verification Code",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verficationToken
      ),
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ verification email sent");
  } catch (err) {
    console.log(err);
    throw new Error(`❌ error sending verification email :  ${err}`);
  }
};

export const sendWelcomeEmail = async (to, username) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"AUTH COMPANY" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Welcome to Auth Company",
      html: WELCOME_EMAIL_TEMPLATE.replace("{username}", username),
      attachments: [
        {
          fileanme: "welcome.png",
          path: path.join(path.resolve(), "backend", "public", "welcome.png"),
          cid: "welcomeImage",
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ welcome email sent");
  } catch (err) {
    console.log(err);
    throw new Error(`❌ error sending welcome email :  ${err}`);
  }
};

export const sendPasswordResetEmail = async (to, resetURL) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"AUTH COMPANY" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Reset Password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Password Reset Request email sent");
  } catch (err) {
    console.log(err);
    throw new Error(`❌ error sending password reset request email :  ${err}`);
  }
};

export const sendPasswordResetSuccessEmail = async (to) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"AUTH COMPANY" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Password Reset Successfully",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Password Reset Success email sent");
  } catch (err) {
    console.log(err);
    throw new Error(`❌ error sending password reset success email :  ${err}`);
  }
};

import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplates.js";
import { mailTrapClient, sender } from "./mailtrap.config.js";

export const sendVerficationEmail = async (email, verficatioToken) => {
  const receipient = [{ email }];

  try {
    const response = await mailTrapClient.send({
      from: sender,
      to: receipient,
      subject: "Verfiy your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verficatioToken
      ),
      category: "Email Verfication",
    });

    console.log("Email Sent Successfully", response);
  } catch (err) {
    console.log(err);
    throw new Error(`Error sending verification email: ${err}`);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const receipient = [{ email }];

  try {
    const response = await mailTrapClient.send({
      from: sender,
      to: receipient,
      template_uuid: "09cd0f64-cebb-4a70-b863-26f1ff0d477d",
      template_variables: {
        company_info_name: "Auth Company",
        name: name,
      },
    });

    console.log("Email sent successfully", response);
  } catch (error) {
    console.log(error);
    throw new Error("Error in sending welcome email : ", error.message);
  }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  const receipient = [{ email }];
  try {
    const response = await mailTrapClient.send({
      from: sender,
      to: receipient,
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      subject: "Reset Password",
      category: "Password Reset Request",
    });

    console.log("Email sent successfully", response);
  } catch (error) {
    console.log(error);
    throw new Error(
      "Error in sending reset password request email: ",
      error.message
    );
  }
};

export const sendResetSuccessEmail = async (email) => {
  const receipient = [{ email }];

  try {
    const response = mailTrapClient.send({
      from: sender,
      to: receipient,
      subject: "Password Reset Successfully",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset",
    });

    console.log("Email sent Successfully: ", response);
  } catch (error) {
    console.log(error);
    throw new Error("Error in sending reset success email: ", err.message);
  }
};

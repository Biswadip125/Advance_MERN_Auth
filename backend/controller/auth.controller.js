import crypto from "crypto";
import bcrypt from "bcryptjs";

import { User } from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
// import {
//   sendPasswordResetEmail,
//   sendResetSuccessEmail,
//   sendWelcomeEmail,
// } from "../mailtrap/mailTrapEmails.js";
import {
  sendVerficationEmail,
  sendWelcomeEmail,
} from "../mailtrap/smtpEmails.js";

export const signup = async (req, res) => {
  const { email, password, fullname } = req.body;

  try {
    if (!email || !password || !fullname) {
      res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const userAlreadyExists = await User.findOne({ email });

    if (userAlreadyExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const user = await User.create({
      email,
      password: hashedPassword,
      fullname,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, //24 hours
    });

    //jwt
    generateTokenAndSetCookie(res, user._id);

    await sendVerficationEmail(user.email, verificationToken);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.log("Error in Creating User: ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error " });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentails",
      });
    }

    const isPasswordVaild = await bcrypt.compare(password, user.password);

    if (!isPasswordVaild) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    generateTokenAndSetCookie(res, user._id);

    user.lastLogin = new Date();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Logged in Successfully",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    console.log("Error in Login User: ", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out Successfully" });
};

export const verifyEmail = async (req, res) => {
  //  1 2 3 4 5 6
  const { code } = req.body;

  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verfication code",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    await user.save();

    await sendWelcomeEmail(user.email, user.fullname);

    res.status(200).json({
      success: true,
      message: "Email verified Successfully",
      user: {
        _id: user._id,
        email: user.email,
        fullname: user.fullname,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    console.log("Error in Verfying email", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invaild Email Id",
      });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    //send email
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (err) {
    console.log("Error in forgot password: ", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error ",
    });
  }
};

export const resetPasword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    //update password
    const hashedPassowrd = await bcrypt.hash(password, 10);

    user.password = hashedPassowrd;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();

    await sendResetSuccessEmail(user.email);

    res.status(200).json({
      success: true,
      message: "Password Reset successfully",
    });
  } catch (err) {
    console.log("Error in reseting pasword : ", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error ",
    });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    console.log("Error in checkAuth: ", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error ",
    });
  }
};

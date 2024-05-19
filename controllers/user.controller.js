import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secretKey = process.env.SECRET_KEY;

const createUser = async (req, res) => {
  console.log("body:", req.body);
  try {
    let user = await User.create(req.body);
    console.log("User created:", {
      userId: user["_id"].toString(),
      name: user.name,
      email: user.email,
      hashedPassword: user.password,
    });
    console.log("OTP:", user.otp, "->", user.email);
    res.status(201).json({
      success: true,
      message: "User created",
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};

//The verifyUser function is designed to authenticate a user based on a One-Time Password (OTP) mechanism
const verifyUser = async (req, res) => {
  try {
    let user = await User.findOneAndUpdate(
      { otp: req.body.otp },
      { otp: "" },
      { new: true } // This option ensures that the updated document is returned
    );
    let token = jwt.sign({ payload: user["_id"] }, secretKey);
    res.cookie("jwtToken", token);
    res.status(200).json({
      success: true,
      message: "Login successfull",
      body: user,
      jwt: token,
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Verification failed",
    });
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body;

  if (email && password) {
    try {
      let user = await User.findOne({ email: email });

      if (user) {
        const hashedPassword = await bcrypt.compare(password, user.password);

        if (hashedPassword) {
          let token = jwt.sign({ payload: user["_id"] }, secretKey);
          res.cookie("jwtToken", token);
          res.json({
            success: true,
            message: "Login Successful",
            body: user,
            jwt: token,
          });
        } else {
          res.json({
            success: false,
            message: "Wrong Credentials",
          });
        }
      } else {
        res.json({
          success: false,
          message: "User not found",
        });
      }
    } catch (err) {
      res.status(401).json({
        success: false,
        message: err.message,
      });
    }
  } else {
    res.json({
      success: false,
      message: "Email or password is empty",
    });
  }
};

//The check function acts as a middleware for protecting routes that require user authentication. Its role is to verify the authenticity of the user's session based on the JWT stored in the login cookie
const check = (req, res, next) => {
  const { jwtToken } = req.cookies;
  if (jwtToken) {
    let user = jwt.verify(jwtToken, secretKey);
    if (user) {
      res.status(200).json({
        success: true,
        message: "Login Successful",
        body: user,
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }
  } else {
    next();
  }
};

const logOut = (req, res) => {
  res.clearCookie("jwtToken");
  res.status(200).json({
    success: true,
    message: "Logout Successful",
  });
};

export { createUser, verifyUser, signIn, check, logOut };

import { User } from "../../models/userSchema.js";
import { Socket } from "socket.io";
import { io } from "../../sever.js";
import {
  hashedPassword,
  unHashedPassword,
} from "../../utils/hashedPassword.js";
import jwt from "jsonwebtoken";

export const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPwd = await hashedPassword(password);
  if (!hashedPwd) {
    console.log("Not able to hash the password");
  }

  try {
    const newUser = new User({
      name,
      email,
      password: hashedPwd,
    });
    await newUser.save();
    return res.status(201).json({
      success: true,
      message: "User created",
    });
  } catch (error) {
    console.error("User creation error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong during user creation",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ Message: "User not found" });
    }
    const exisitingPwd = unHashedPassword(password, existingUser.password);
    if (!exisitingPwd) {
      return res
        .status(400)
        .json({ Message: "Given Password is not matching" });
    }

    existingUser.lastActive = new Date();
    await existingUser.save();

    //jwt token handover
    const token = jwt.sign(
      {
        id: existingUser._id,
        email: existingUser.email,
        name: existingUser.name,
      },
      process.env.JWT_SECRET,
      { algorithm: "HS256" }
    );
    if (token) {
      console.log("Succesfully logged in");
      return res.status(200).json({
        success: true,
        token,
      });
    }
  } catch (error) {
    console.log("error while login ", error.stack);
    return res.status(500).json({ Error: "Error occured while login" });
  }
};

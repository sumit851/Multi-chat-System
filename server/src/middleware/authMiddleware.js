import jwt from "jsonwebtoken";
import { Socket } from "socket.io";
import { io } from "../sever.js";

export const tokenVerification = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      console.log("token not recieved");
      return res.status(401).json({ error: "No token provided" });
    }
    const decodedToken = token.replace("Bearer ", "");

    const verifiedToken = jwt.verify(decodedToken, process.env.JWT_SECRET);
    req.user = verifiedToken;
    next();
  } catch (error) {
    console.log("Error occurerd while doing verification");
    return res.status(403).json({ error: "verification failed" });
  }
};

export const socketVerification = (socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication Error"));
    }
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = verifiedToken.id;
    socket.userName = verifiedToken.name;
    next();
  } catch (error) {
    console.log("Socket Authentication error:", error.stack);
    return next(new Error("Authentication failed"));
  }
};

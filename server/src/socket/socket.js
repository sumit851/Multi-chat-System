import { socketVerification } from "../middleware/authMiddleware.js";
import { privateChatHandler } from "./groupEventHandler.js";
import { roomEventHandler } from "./roomEventHandler.js";
import { addUser, removeUser } from "./socketMap.js";

export const socketServer = (io) => {
  try {
    io.use(socketVerification);
    io.on("connection", (socket) => {
      console.log("Welcome  new User");
      console.log(`User connected: ${socket.id}`);

      addUser(socket.userId, socket.id);

      privateChatHandler(io, socket);
      roomEventHandler(io, socket);

      socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
      });
    });
  } catch (error) {
    console.log("socker server is not connecting :", error.stack);
  }
};

import { Messgae } from "../models/messageSchema.js";

export const roomEventHandler = (io, socket) => {
  socket.on("join_room", async (roomId) => {
    socket.join(roomId);
    console.log("user joined room", socket.userName, roomId);

    socket.to(roomId).emit("user_joined", {
      userId: getUserScoketId,
      userName: socket.userName,
    });

    //message fecthed from database
    try {
    } catch (error) {}
  });
  socket.on("group_message", async ({ roomId, message }) => {
    try {
      const newMessage = new Messgae({
        sender: socket.userId,
        content: message,
        room: roomId,
      });
      await newMessage.save();

      console.log("user connected");
      socket.to(roomId).emit("new_message", () => {
        console.log("A user connected");
      });
    } catch (error) {
      console.error("Error saving message:", error);
      socket.emit("error", "Failed to send message");
    }
  });
};

import { Messgae } from "../models/messageSchema.js";
import { getUserScoketId } from "./socketMap.js";

export const privateChatHandler = (io, socket) => {
  socket.on("private_message", async ({ reciptId, message }) => {
    try {
      console.log("Message request received:");
      console.log("- From socket ID:", socket.id);
      console.log("- From user ID:", socket.userId);
      console.log("- To recipient ID:", reciptId);
      const privateRoomId = [socket.userId, reciptId].sort().join("_");
      const newMessage = new Messgae({
        sender: socket.userId,
        content: message,
        room: privateRoomId,
      });

      await newMessage.save();
      +socket.join(privateRoomId);
      const recipientSocketId = getUserScoketId(reciptId);
      console.log(
        `Recipient socket ID: ${recipientSocketId || "Not found (offline)"}`
      );

      if (recipientSocketId) {
        const recipientSocket = io.sockets.sockets.get(recipientSocketId);
        if (recipientSocket) {
          recipientSocket.join(privateRoomId);
          console.log(`Added recipient to room ${privateRoomId}`);
        }
      }
      socket.to(privateRoomId).emit("new_message", {
        content: message,
      });
      console.log("Message sent to reciptanat");
    } catch (error) {
      console.error("Error sending private message:", error);
      socket.emit("error", "Failed to send private message");
    }
  });

  //load private chat from history
  socket.on("load_private_chat", async (recipientId) => {
    try {
      const privateRoomId = [socket.userId, recipientId].sort().join("_");

      const messages = await Message.find({ room: privateRoomId })
        .sort({ createdAt: -1 })
        .limit(50)
        .populate("sender", "name");

      socket.emit("private_chat_history", {
        recipientId,
        messages: messages.reverse(),
      });
    } catch (error) {
      console.error("Error loading private chat history:", error);
      socket.emit("error", "Failed to load chat history");
    }
  });
};

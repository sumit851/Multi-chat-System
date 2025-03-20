import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { dbConnection } from "./models/db.js";
import userRouter from "./controllers/user/createUser.js";
import { socketServer } from "./socket/socket.js";

dotenv.config({ path: ".env" });

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(userRouter);

socketServer(io);

httpServer.listen(PORT, () => {
  dbConnection();
  console.log(`Server Listening at ${PORT}`);
});

export { io, httpServer, app };

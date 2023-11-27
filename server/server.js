import express from "express";
import dotenv from "dotenv";
import { createServer } from "node:http";
import { Server } from "socket.io";
import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { connectDB } from "./helpers/connectDB.js";
import cors from "cors";

dotenv.config();
const app = express();

connectDB();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? "https://chat-mingle-web.netlify.app"
        : "http://localhost:5173",

    credentials: true,
  },
});

// Middlewares
app.use(cors());
app.use(express.json());

// API endpoints
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/messages", messageRoutes);

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  socket.emit("online-users", Object.fromEntries(onlineUsers));

  socket.on("add-user", (userId) => {
    // storing socket id as value so later will connect to it
    onlineUsers.set(userId, socket.id);
    io.emit("online-users", Object.fromEntries(onlineUsers));
  });

  socket.on("remove-user", (userId) => {
    onlineUsers.delete(userId);
    io.emit("online-users", Object.fromEntries(onlineUsers));
  });

  socket.on("send-msg", (data) => {
    const receiverSocketOnline = onlineUsers.get(data.receiver);
    if (receiverSocketOnline) {
      socket.to(receiverSocketOnline).emit("rcv-msg", data);
    }
  });
});

httpServer.listen(process.env.PORT, () => {
  console.log(`Listening on ${process.env.PORT}`);
});

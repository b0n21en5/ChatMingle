import express from "express";
import dotenv from "dotenv";
import { createServer } from "node:http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "node:url";
import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { connectDB } from "./helpers/connectDB.js";
import cors from "cors";
import bodyParser from "express";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config();
const app = express();

connectDB();

const httpServer = createServer(app);
const io = new Server(httpServer);

// Middlewares
app.use(cors());
app.use(express.json());

// API endpoints
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/messages", messageRoutes);

// app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

io.on("connection", (socket) => {
  console.log("user connected");

  socket.on("chat-msg", (msg) => {
    socket.broadcast.emit("rcv-msg", msg);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected!");
  });
});

httpServer.listen(process.env.PORT, () => {
  console.log(`Listening on ${process.env.PORT}`);
});

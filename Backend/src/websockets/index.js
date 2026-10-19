import { broradCast } from "./main.js";
import { Server } from "socket.io";
import { socketAuth } from "../middleware/jwt.middleware.js";

const allowedOrigins = [
  "https://draw-board-92ae.vercel.app",
  "http://localhost:5173",
];

export const socketserver = (server) => {
  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["polling", "websocket"],
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.use(socketAuth);
    broradCast(io, socket);
  return io;
};
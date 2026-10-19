import { broradCast } from "./main.js";
import { Server } from 'socket.io'
import {socketAuth} from  "../middleware/jwt.middleware.js"

export const socketserver = (server) => {
    const io = new Server(server, {
        cors: {
           origin:"draw-board-92ae.vercel.app",
           credentials:true
        }
    })
    io.use(socketAuth)
    io.on("connection", (socket) => {
        broradCast(io,socket)
    });
}


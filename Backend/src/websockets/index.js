import { broradCast } from "./main.js";
import { Server } from 'socket.io'
import { rooms } from "./WebSockethepler.js"
export const socketserver = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173"
        }
    })
    io.on("connection", (socket) => {
        broradCast(io,socket)

       
    });
}


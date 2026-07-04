import { broradCast } from "./main.js";
import { Server } from 'socket.io'
import { rooms } from "./WebSockethepler.js"
export const socketserver = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "draw-board-92ae.vercel.app"
        }
    })
    io.on("connection", (socket) => {
        broradCast(io,socket)

       
    });
}


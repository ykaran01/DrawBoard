import { createMessage } from "../controllers/message.controller.js"


import { rooms } from "./WebSockethepler.js"
import { handleUser } from "./WebSockethepler.js"

export const broradCast = (io, socket) => {
    socket.on("join-room", ({ roomId, user }) => {
        socket.join(roomId)
        if (!rooms.has(roomId)) {
            rooms.set(roomId, {
                users: {}
            })
        }
        const room = rooms.get(roomId)
        room.users[socket.id] = user
        socket.boardId = roomId
        io.to(roomId).emit("present_user", Object.values(room["users"]));
    })

    socket.on("canvas-data", (data) => {

        socket.to(socket.boardId).emit("canvas_recieve", data);
    });
    socket.on("current-address", (data) => {

        socket.to(socket.boardId).emit("canvas_pointer", data)
    })
    socket.on("message-sent", async (data) => {
        const message = await createMessage(data.message, socket.boardId || data.roomid, data.user)
        io.to(socket.boardId).emit("message-recieve", message);
    })
    socket.on("undo-canvas", (data) => {
        socket.to(socket.boardId).emit("undo", data)
    })
    socket.on("clear-canvas", (data) => {
        socket.to(socket.boardId).emit("clear", data)
    })

    socket.on("room_leave", (data) => {
        handleUser(socket,io)
    })
    socket.on("disconnect", () => {
         handleUser(socket,io)
    })
}
import { createMessage } from "../controllers/message.controller.js"

export const broradCast = (io, socket) => {
    socket.on("join-room", (boardId) => {
        socket.join(boardId)
      
        socket.boardId = boardId
    })
    socket.on("canvas-data", (data) => {

        socket.to(socket.boardId).emit("canvas_recieve", data);
    });
    socket.on("current-address", (data) => {

        socket.to(socket.boardId).emit("canvas_pointer", data)
    })
    socket.on("message-sent", async(data) => {
        const message = await createMessage(data.message,socket.boardId || data.roomid,data.user)
        io.to(socket.boardId).emit("message-recieve", message);
    })
    socket.on("undo-canvas", (data) => {
        socket.to(socket.boardId).emit("undo", data)
    })
    socket.on("clear-canvas", (data) => {
        socket.to(socket.boardId).emit("clear", data)
    })
}
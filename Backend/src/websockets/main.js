

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
    socket.on("message-sent", (data) => {
        io.to(socket.boardId).emit("message-recieve", data);
    })
    socket.on("undo-canvas", (data) => {
        socket.to(socket.boardId).emit("undo", data)
    })
    socket.on("clear-canvas", (data) => {
        socket.to(socket.boardId).emit("clear", data)
    })
}
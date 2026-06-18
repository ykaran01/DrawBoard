

export const broradCast = (io, socket) => {
    // socket.on("join-board", (boardId) => {
    // //     socket.join(boardId)
    // //     socket.boatrdId = boardId
    // // })
    socket.on("canvas-data", (data) => {

        socket.broadcast.emit("canvas_recieve", data);
    });
    socket.on("current-address", (data) => {
    
        socket.broadcast.emit("canvas_pointer", data)
    })
    socket.on("undo-canvas", (data) => {
        socket.broadcast.emit("undo", data)
    })
    socket.on("clear-canvas", (data) => {
        socket.broadcast.emit("clear", data)
    })
}
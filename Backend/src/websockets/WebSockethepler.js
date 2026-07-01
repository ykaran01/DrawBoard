
export const rooms = new Map()

export const handleUser = (socket,io )=>{
    if (rooms.has(socket.boardId)) {

            const room = rooms.get(socket.boardId)
            delete room.users[socket.id]

            io.to(socket.boardId).emit("present_user", Object.values(room["users"]));

            if (Object.keys(room.users).length == 0) {
                rooms.delete(socket.boardId)

            }
        }
}
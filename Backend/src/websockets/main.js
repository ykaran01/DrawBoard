import { createMessage } from "../controllers/message.controller.js";
import { Board } from "../models/board.module.js";
import { rooms, handleUser } from "./WebSockethepler.js";

const permission = ["viewer", "editor"];

export const broradCast = (io, socket) => {
  const getSession = async () => {
    
    if (!socket.userId || !socket.boardId) return null;
    const board = await Board.findOne({boardId:socket.boardId});
    if (!board) return null;
    const role =
      String(board.owner) === String(socket.userId)
        ? "Admin"
        : board.users.find(
            (u) => String(u.user) === String(socket.userId)
          )?.role;

    if (!role) return null;

    return { board, role };
  };

  const canEdit = (role) =>role === "Admin" || role === "editor";

  socket.on("join-room", async ({ roomId ,user:user_data } = {}) => {
    try {
      const user = socket.user;

      if (!user?._id || !roomId) return;

      const board = await Board.findOne({boardId:roomId});

      if (!board) {
        socket.emit("board_error", {
          message: "No such board exists",
        });
        return;
      }

      const userId = String(user._id);
     
      const role =
        String(board.owner) === userId
          ? "Admin"
          : board.users.find(
              (u) => String(u.user) === userId
            )?.role;

      if (!role) {
        socket.emit("board_error", {
          message: "You don't have access to this board",
        });
        return;
      }
     
      socket.boardId = String(roomId);
      socket.userId = userId;
      socket.role = role;

      await socket.join(socket.boardId);

      if (!rooms.has(socket.boardId)) {
        rooms.set(socket.boardId, { users: {} });
      }

      const room = rooms.get(socket.boardId);
      if(!room.users[userId]){
         socket.emit("user_join", room.users[userId]);
      }
      room.users[userId] = {
        id: userId,
        name: user_data?.name ,
        username: user_data?.username,
        role,
        avatar:user_data?.avatar
      };

      io.to(socket.boardId).emit(
        "present_user",
        Object.values(room.users)
      );
    } catch (err) {
      socket.emit("board_error", { message: err.message });
    }
  });

  socket.on("canvas-data", async (data) => {
    try {
      const session = await getSession();

      if (!session || !canEdit(session.role)) return;

      socket.to(socket.boardId).emit("canvas_recieve", data);
    } catch (err) {
      socket.emit("board_error", { message: err.message });
    }
  });

  socket.on("current-address", async (data) => {
    try {
      const session = await getSession();
      if (!session) return;

      socket.to(socket.boardId).emit("canvas_pointer", data);
    } catch (err) {
      socket.emit("board_error", { message: err.message });
    }
  });

  socket.on("message-sent", async ({ message } = {}) => {
    try {
      if (typeof message !== "string" || !message.trim()) return;

      const savedMessage = await createMessage(
        message.trim(),
        socket.boardId,
        socket.userId
      );

      io.to(socket.boardId).emit("message-recieve", savedMessage);
    } catch (err) {
      socket.emit("board_error", { message: err.message });
    }
  });

  socket.on("undo-canvas", async (data) => {
    try {
      const session = await getSession();
      if (!session || !canEdit(session.role)) return;

      socket.to(socket.boardId).emit("undo", data);
    } catch (err) {
      socket.emit("board_error", { message: err.message });
    }
  });

  socket.on("clear-canvas", async (data) => {
    try {
      const session = await getSession();
      if (!session || !canEdit(session.role)) return;

      socket.to(socket.boardId).emit("clear", data);
    } catch (err) {
      socket.emit("board_error", { message: err.message });
    }
  });

  socket.on("change-permision", async ({ id, changeto } = {}) => {
    try {
      const session = await getSession();
    
      if (!session || session.role !== "Admin") {
        socket.emit("prermission_error", {
          message: "Only the admin can change permissions",
        });
        return;
      }
      
      if (!id || !permission.includes(changeto)) {
        socket.emit("prermission_error", {
          message: "Invalid user ID or role",
        });
        return;
      } 
     

      if (String(id) === String(session.board.owner)) {
        socket.emit("prermission_error", {
          message: "The board owner cannot be changed to a regular role",
        });
        return;
      }

      const result = await Board.updateOne(
        {
          boardId: socket.boardId,
          owner: socket.userId,
          "users.user": id,
        },
        {
          $set: {
            "users.$.role": changeto,
          },
        }
      );

      if (!result.matchedCount) {
        socket.emit("prermission_error", {
          message: "User not found",
        });
        return;
      }

      const room = rooms.get(socket.boardId);

      if (room?.users?.[String(id)]) {
        room.users[String(id)].role = changeto;
      }

      io.to(socket.boardId).emit(
        "present_user",
        Object.values(room?.users ?? {})
      );

      socket.emit("permision_successfull", {
        message: "User permission updated successfully",
      });
    } catch (err) {
      socket.emit("prermission_error", {
        message: err.message,
      });
    }
  });

  socket.on("room_leave", () => handleUser(socket, io));

  socket.on("disconnect", () => handleUser(socket, io));
};

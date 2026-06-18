import { useEffect } from "react";

export const useCanvasSocket = (socket, setElements, setpointer) => {
  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => console.log("Connected:", socket.id));

    socket.on("canvas_recieve", (data) => {
      setElements((prev) => {
        const indx = prev.findIndex((value) => value.id === data.id);
        if (indx === -1) return [...prev, data];
        const update = [...prev];
        update[indx] = data;
        return update;
      });
    });

    socket.on("canvas_pointer", (data) => {
      setpointer((prev) => ({
        ...prev,
        [data.id]: { x: data.x, y: data.y },
      }));
    });

    socket.on("redo", (data) => setElements(data));
    socket.on("undo", (data) => setElements(data));
    socket.on("clear", () => setElements([]));

    return () => {
      socket.off("connect");
      socket.off("canvas_recieve");
      socket.off("canvas_pointer");
      socket.off("redo");
      socket.off("undo");
      socket.off("clear");
    };
  }, [socket, setElements, setpointer]);
};
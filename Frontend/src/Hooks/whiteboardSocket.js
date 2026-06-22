
import { useEffect } from "react";
import * as fabric from "fabric";
import { socket } from "../socket";

export const useSocketCanvas = (canvasRef) => {

  useEffect(() => {

    const handleCanvasReceive = (data) => {
      const canvas = canvasRef.current;

      if (!canvas || !data) return;

      const existingObj = canvas
        .getObjects()
        .find(obj => obj.id === data.id);

      if (existingObj) {
        existingObj.set(data);
        canvas.renderAll();
      } else {
        fabric.util.enlivenObjects([data]).then((objects) => {
          objects.forEach((obj) => {
            obj.programmatic = true;
            canvas.add(obj);
          });

          canvas.renderAll();
        });
      }
    };

    const handleUndo = (id) => {
      const canvas = canvasRef.current;

      if (!canvas) return;

      const obj = canvas
        .getObjects()
        .find(item => item.id === id);

      if (obj) {
        canvas.remove(obj);
        canvas.renderAll();
      }
    };

    const handleClear = () => {
      const canvas = canvasRef.current;

      if (!canvas) return;

      canvas.clear();
    };

    socket.on("canvas_recieve", handleCanvasReceive);
    socket.on("undo", handleUndo);
    socket.on("clear", handleClear);

    return () => {
      socket.off("canvas_recieve");
      socket.off("undo");
      socket.off("clear");
    };

  }, [canvasRef]);
};

import { useEffect } from "react";
import * as fabric from "fabric";
import { socket } from "../socket";

export const useSocketCanvas = (canvasRef, setuserpointer) => {

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
    const handlepointer = (data) => {
      console.log(data)
      setuserpointer((prev) => ({
        ...prev,
        [data.id]: data
      }))
    }



    socket.on("canvas_recieve", handleCanvasReceive);
    socket.on("undo", handleUndo);
    socket.on("clear", handleClear);
    socket.on("canvas_pointer", handlepointer)
    


    return () => {
      socket.off("canvas_recieve");
      socket.off("undo");
      socket.off("clear");
      socket.off('canvas_pointer')
    };

  }, [canvasRef]);
};